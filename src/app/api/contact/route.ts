import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { createClient } from "redis";

type ContactPayload = {
  company?: string;
  email?: string;
  message?: string;
  name?: string;
  website?: string;
};

const MAX_NAME_LENGTH = 120;
const MAX_EMAIL_LENGTH = 160;
const MAX_COMPANY_LENGTH = 160;
const MAX_MESSAGE_LENGTH = 4000;
const RATE_LIMIT_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT_MAX_REQUESTS = 5;

const requestBuckets = new Map<string, number[]>();
const RATE_LIMIT_PREFIX = process.env.REDIS_PREFIX ?? "contact-rate-limit";
type RedisClient = ReturnType<typeof createClient>;

let redisClient: RedisClient | null = null;
let redisConnectPromise: Promise<RedisClient | null> | null = null;

function getRequiredEnv(name: string) {
  const value = process.env[name];

  return value && value.trim().length > 0 ? value : null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isWithinLengthLimit(value: string, maxLength: number) {
  return value.length > 0 && value.length <= maxLength;
}

function getClientAddress(request: Request) {
  const forwardedFor = request.headers.get("x-forwarded-for");

  if (forwardedFor) {
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

function isRateLimited(clientAddress: string) {
  const now = Date.now();
  const bucket = requestBuckets.get(clientAddress) ?? [];
  const activeEntries = bucket.filter(
    (timestamp) => now - timestamp < RATE_LIMIT_WINDOW_MS,
  );

  if (activeEntries.length >= RATE_LIMIT_MAX_REQUESTS) {
    requestBuckets.set(clientAddress, activeEntries);
    return true;
  }

  activeEntries.push(now);
  requestBuckets.set(clientAddress, activeEntries);
  return false;
}

async function getRedisClient() {
  const redisUrl = process.env.REDIS_URL?.trim();

  if (!redisUrl) {
    return null;
  }

  if (redisClient?.isOpen) {
    return redisClient;
  }

  if (redisConnectPromise) {
    return redisConnectPromise;
  }

  redisConnectPromise = (async () => {
    try {
      const client = createClient({
        url: redisUrl,
      });

      client.on("error", (error) => {
        console.error("Redis rate limit client error.", error);
      });

      await client.connect();
      redisClient = client;
      return client;
    } catch (error) {
      console.error("Redis rate limit connection failed.", error);
      redisClient = null;
      return null;
    } finally {
      redisConnectPromise = null;
    }
  })();

  return redisConnectPromise;
}

async function isRedisRateLimited(clientAddress: string) {
  const client = await getRedisClient();

  if (!client) {
    return isRateLimited(clientAddress);
  }

  const key = `${RATE_LIMIT_PREFIX}:${clientAddress}`;
  const requestCount = await client.incr(key);

  if (requestCount === 1) {
    await client.expire(key, Math.ceil(RATE_LIMIT_WINDOW_MS / 1000));
  }

  return requestCount > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;
    const name = payload.name?.trim() ?? "";
    const email = payload.email?.trim() ?? "";
    const company = payload.company?.trim() ?? "";
    const message = payload.message?.trim() ?? "";
    const website = payload.website?.trim() ?? "";
    const clientAddress = getClientAddress(request);

    if (website) {
      return NextResponse.json({ ok: true });
    }

    if (await isRedisRateLimited(clientAddress)) {
      return NextResponse.json(
        { error: "Rate limit exceeded." },
        { status: 429 },
      );
    }

    if (
      !isWithinLengthLimit(name, MAX_NAME_LENGTH) ||
      !isWithinLengthLimit(email, MAX_EMAIL_LENGTH) ||
      !message ||
      message.length > MAX_MESSAGE_LENGTH ||
      company.length > MAX_COMPANY_LENGTH ||
      !isValidEmail(email)
    ) {
      return NextResponse.json(
        { error: "Invalid contact payload." },
        { status: 400 },
      );
    }

    const smtpHost = getRequiredEnv("SMTP_HOST");
    const smtpPort = getRequiredEnv("SMTP_PORT");
    const smtpUser = getRequiredEnv("SMTP_USER");
    const smtpPass = getRequiredEnv("SMTP_PASS");
    const contactToEmail = getRequiredEnv("CONTACT_TO_EMAIL");
    const contactFromEmail =
      getRequiredEnv("CONTACT_FROM_EMAIL") ?? contactToEmail;

    if (
      !smtpHost ||
      !smtpPort ||
      !smtpUser ||
      !smtpPass ||
      !contactToEmail ||
      !contactFromEmail
    ) {
      console.error("Contact email is not configured in the runtime environment.");

      return NextResponse.json(
        { error: "Contact email is not configured." },
        { status: 503 },
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: Number(smtpPort),
      secure: Number(smtpPort) === 465,
      auth: {
        user: smtpUser,
        pass: smtpPass,
      },
    });

    await transporter.sendMail({
      from: contactFromEmail,
      to: contactToEmail,
      replyTo: email,
      subject: `New landing contact from ${name}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Company: ${company || "-"}`,
        "",
        message,
      ].join("\n"),
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #18181b;">
          <h2 style="margin-bottom: 16px;">New landing contact</h2>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Company:</strong> ${company || "-"}</p>
          <p><strong>Message:</strong></p>
          <p>${message.replace(/\n/g, "<br />")}</p>
        </div>
      `,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Contact form delivery failed.", error);

    return NextResponse.json(
      { error: "Failed to send contact email." },
      { status: 500 },
    );
  }
}
