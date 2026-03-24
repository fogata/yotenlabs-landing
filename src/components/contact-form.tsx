"use client";

import { useState } from "react";

type ContactFormLabels = {
  availability: string;
  cta: string;
  directLabel: string;
  directValue: string;
  error: string;
  eyebrow: string;
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
};

const initialState: FormState = {
  name: "",
  email: "",
  company: "",
  website: "",
  message: "",
};

export function ContactForm({
  description,
  labels,
  title,
  titleId,
}: ContactFormProps) {
  const [formState, setFormState] = useState<FormState>(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [status, setStatus] = useState<{
    kind: "error" | "success";
    message: string;
  } | null>(null);

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

      if (!response.ok) {
        throw new Error("Request failed");
      }

      setFormState(initialState);
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
    <div className="grid gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <div className="rounded-[1.85rem] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.24)] sm:p-8">
        <div className="space-y-4">
          <p className="font-mono text-xs uppercase tracking-[0.28em] text-amber-300/70">
            {labels.eyebrow}
          </p>
          <h2
            id={titleId}
            className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl"
          >
            {title}
          </h2>
          <p className="max-w-xl text-base leading-7 text-zinc-300 sm:text-lg">
            {description}
          </p>
        </div>

        <div className="mt-8 space-y-4 rounded-[1.5rem] border border-white/10 bg-black/20 p-5">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-[0.26em] text-zinc-500">
              {labels.directLabel}
            </p>
            <a
              href={`mailto:${labels.directValue}`}
              className="mt-2 inline-flex text-sm font-medium text-zinc-100 underline decoration-white/20 underline-offset-4 hover:text-white"
            >
              {labels.directValue}
            </a>
          </div>
          <div className="rounded-full border border-amber-300/10 bg-amber-300/8 px-4 py-2 text-sm text-amber-100/90">
            {labels.availability}
          </div>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[1.85rem] border border-white/10 bg-white/[0.045] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.28)] backdrop-blur-sm sm:p-8"
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-200">
              {labels.fields.name}
            </span>
            <input
              name="name"
              type="text"
              value={formState.name}
              onChange={handleChange}
              required
              placeholder={labels.placeholders.name}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-amber-300/40 focus:bg-black/25"
            />
          </label>

          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-200">
              {labels.fields.email}
            </span>
            <input
              name="email"
              type="email"
              value={formState.email}
              onChange={handleChange}
              required
              placeholder={labels.placeholders.email}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-amber-300/40 focus:bg-black/25"
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
            <span className="text-sm font-medium text-zinc-200">
              {labels.fields.company}
            </span>
            <input
              name="company"
              type="text"
              value={formState.company}
              onChange={handleChange}
              placeholder={labels.placeholders.company}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500 focus:border-amber-300/40 focus:bg-black/25"
            />
          </label>
        </div>

        <div className="mt-4">
          <label className="space-y-2">
            <span className="text-sm font-medium text-zinc-200">
              {labels.fields.message}
            </span>
            <textarea
              name="message"
              value={formState.message}
              onChange={handleChange}
              required
              rows={6}
              placeholder={labels.placeholders.message}
              className="min-h-40 w-full rounded-[1.5rem] border border-white/10 bg-black/20 px-4 py-3 text-sm leading-7 text-white outline-none placeholder:text-zinc-500 focus:border-amber-300/40 focus:bg-black/25"
            />
          </label>
        </div>

        <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:translate-y-[-1px] hover:bg-zinc-100 disabled:cursor-wait disabled:opacity-70"
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
