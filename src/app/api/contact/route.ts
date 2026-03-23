import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

type ContactPayload = {
  company?: string;
  email?: string;
  message?: string;
  name?: string;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];

  return value && value.trim().length > 0 ? value : null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as ContactPayload;
    const name = payload.name?.trim() ?? "";
    const email = payload.email?.trim() ?? "";
    const company = payload.company?.trim() ?? "";
    const message = payload.message?.trim() ?? "";

    if (!name || !email || !message || !isValidEmail(email)) {
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
