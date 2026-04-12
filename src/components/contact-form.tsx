"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";

type TurnstileInstance = {
  remove?: (widgetId?: string) => void;
  render: (
    container: HTMLElement,
    options: {
      callback?: (token: string) => void;
      "error-callback"?: () => void;
      "expired-callback"?: () => void;
      sitekey: string;
      size?: "compact" | "flexible" | "normal";
      theme?: "auto" | "dark" | "light";
    },
  ) => string;
  reset: (widgetId?: string) => void;
};

declare global {
  interface Window {
    turnstile?: TurnstileInstance;
  }
}

type ContactFormLabels = {
  availability: string;
  cta: string;
  directLabel: string;
  directValue: string;
  error: string;
  eyebrow: string;
  verificationError: string;
  verificationRequired: string;
  fields: {
    company: string;
    email: string;
    message: string;
    name: string;
  };
  placeholders: {
    company: string;
    email: string;
    message: string;
    name: string;
  };
  sending: string;
  success: string;
};

type ContactFormProps = {
  description: string;
  labels: ContactFormLabels;
  title: string;
  titleId: string;
};

type FormState = {
  company: string;
  email: string;
  website: string;
  message: string;
  name: string;
  turnstileToken: string;
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  website: "",
  message: "",
  turnstileToken: "",
};

const turnstileSiteKey =
  process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY?.trim() ?? "";
const isTurnstileEnabled = turnstileSiteKey.length > 0;

export function ContactForm({
  description,
  labels,
  title,
  titleId,
}: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isTurnstileReady, setIsTurnstileReady] = useState(!isTurnstileEnabled);
  const [status, setStatus] = useState<{
    kind: "error" | "success";
    message: string;
  } | null>(null);
  const turnstileContainerRef = useRef<HTMLDivElement | null>(null);
  const turnstileWidgetIdRef = useRef<string | null>(null);

  useEffect(() => {
    if (
      !isTurnstileEnabled ||
      !isTurnstileReady ||
      !turnstileContainerRef.current ||
      !window.turnstile ||
      turnstileWidgetIdRef.current
    ) {
      return;
    }

    turnstileWidgetIdRef.current = window.turnstile.render(
      turnstileContainerRef.current,
      {
        sitekey: turnstileSiteKey,
        theme: "dark",
        size: "flexible",
        callback: (token) => {
          setFormState((current) => ({
            ...current,
            turnstileToken: token,
          }));
          setStatus(null);
        },
        "expired-callback": () => {
          setFormState((current) => ({
            ...current,
            turnstileToken: "",
          }));
        },
        "error-callback": () => {
          setFormState((current) => ({
            ...current,
            turnstileToken: "",
          }));
          setStatus({
            kind: "error",
            message: labels.verificationError,
          });
        },
      },
    );

    return () => {
      const widgetId = turnstileWidgetIdRef.current;

      if (widgetId) {
        window.turnstile?.remove?.(widgetId);
        turnstileWidgetIdRef.current = null;
      }
    };
  }, [isTurnstileReady, labels.verificationError]);

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = event.target;

    setFormState((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (isTurnstileEnabled && !formState.turnstileToken) {
      setStatus({
        kind: "error",
        message: labels.verificationRequired,
      });
      return;
    }

    setIsSubmitting(true);
    setStatus(null);

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formState),
      });
      const payload = (await response.json().catch(() => null)) as
        | { error?: string }
        | null;

      if (!response.ok) {
        if (response.status === 400 || response.status === 403) {
          setStatus({
            kind: "error",
            message: labels.verificationError,
          });
          window.turnstile?.reset(turnstileWidgetIdRef.current ?? undefined);
          setFormState((current) => ({
            ...current,
            turnstileToken: "",
          }));
          return;
        }

        throw new Error(payload?.error ?? "Request failed");
      }

      setFormState({
        ...initialState,
      });
      window.turnstile?.reset(turnstileWidgetIdRef.current ?? undefined);
      setStatus({
        kind: "success",
        message: labels.success,
      });
    } catch {
      setStatus({
        kind: "error",
        message: labels.error,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="overflow-hidden rounded-sm bg-[var(--surface-low)] lg:grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      {isTurnstileEnabled ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit"
          strategy="afterInteractive"
          onLoad={() => {
            setIsTurnstileReady(true);
          }}
        />
      ) : null}

      <div className="bg-[linear-gradient(135deg,#151d26,#0b1219)] p-8 sm:p-12 lg:p-14">
        <div className="space-y-4">
          <p className="font-mono text-[10px] uppercase text-[var(--muted-dim)]">
            {labels.eyebrow}
          </p>
          <h2
            id={titleId}
            className="max-w-md text-4xl font-semibold text-white"
          >
            {title}
          </h2>
          <p className="max-w-md text-sm leading-7 text-[var(--muted)]">
            {description}
          </p>
        </div>

        <div className="mt-10 space-y-5">
          <div>
            <p className="font-mono text-[10px] uppercase text-[var(--muted-dim)]">
              {labels.directLabel}
            </p>
            <a
              href={`mailto:${labels.directValue}`}
              className="mt-2 inline-flex text-sm font-medium text-zinc-100 underline decoration-[var(--accent-cyan)]/40 underline-offset-4 hover:text-white"
            >
              {labels.directValue}
            </a>
          </div>
          <div className="inline-flex rounded-sm bg-[rgba(194,255,95,0.1)] px-4 py-2 text-xs text-[var(--accent-lime)]">
            {labels.availability}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="bg-[#090f15] p-8 sm:p-12 lg:p-14"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase text-[var(--muted-dim)]">
              {labels.fields.name}
            </span>
            <input
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              required
              placeholder={labels.placeholders.name}
              className="w-full border-0 border-b border-[var(--border)] bg-transparent px-0 py-3 text-sm text-white outline-none placeholder:text-[var(--muted-dim)] focus:border-[var(--accent-cyan)]"
            />
          </label>

          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase text-[var(--muted-dim)]">
              {labels.fields.email}
            </span>
            <input
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              required
              placeholder={labels.placeholders.email}
              className="w-full border-0 border-b border-[var(--border)] bg-transparent px-0 py-3 text-sm text-white outline-none placeholder:text-[var(--muted-dim)] focus:border-[var(--accent-cyan)]"
            />
          </label>
        </div>

        <div className="mt-4">
          <div className="hidden" aria-hidden="true">
            <label>
              <span>Website</span>
              <input
                name="website"
                type="text"
                tabIndex={-1}
                autoComplete="off"
                value={formState.website}
                onChange={handleChange}
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase text-[var(--muted-dim)]">
              {labels.fields.company}
            </span>
            <input
              name="company"
              type="text"
              value={formState.company}
              onChange={handleChange}
              placeholder={labels.placeholders.company}
              className="w-full border-0 border-b border-[var(--border)] bg-transparent px-0 py-3 text-sm text-white outline-none placeholder:text-[var(--muted-dim)] focus:border-[var(--accent-cyan)]"
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="space-y-2">
            <span className="font-mono text-[10px] uppercase text-[var(--muted-dim)]">
              {labels.fields.message}
            </span>
            <textarea
              name="message"
              value={formState.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder={labels.placeholders.message}
              className="min-h-32 w-full resize-none border-0 border-b border-[var(--border)] bg-transparent px-0 py-3 text-sm leading-7 text-white outline-none placeholder:text-[var(--muted-dim)] focus:border-[var(--accent-cyan)]"
            />
          </label>
        </div>

        {isTurnstileEnabled ? (
          <div className="mt-4 rounded-sm border border-[var(--border)] bg-[var(--surface-low)] p-4">
            <div
              ref={turnstileContainerRef}
              className="min-h-[72px]"
              data-testid="turnstile-widget"
            />
          </div>
        ) : null}

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-sm bg-[var(--accent-cyan)] px-8 py-3 text-xs font-semibold text-[#031014] hover:translate-y-[-1px] disabled:cursor-wait disabled:opacity-70"
          >
            {isSubmitting ? labels.sending : labels.cta}
          </button>

          {status ? (
            <p
              className={`text-sm ${
                status.kind === "success" ? "text-emerald-300" : "text-rose-300"
              }`}
            >
              {status.message}
            </p>
          ) : null}
        </div>
      </form>
    </div>
  );
}
