import Image from "next/image";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
import { DynamicBackground } from "@/components/dynamic-background";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/get-messages";

type PitchDeckPageProps = {
  locale: Locale;
  messages: Messages;
};

type PitchSlide = {
  id: string;
  kicker: string;
  title: string;
  description?: string;
  points?: string[];
  callout?: string;
  groups?: Array<{
    title: string;
    points: string[];
  }>;
  table?: {
    headers: [string, string];
    rows: Array<[string, string]>;
  };
};

export function PitchDeckPage({ locale, messages }: PitchDeckPageProps) {
  const { pitchDeck } = messages;
  const slides = pitchDeck.slides as PitchSlide[];
  const contactSectionId = "pitch-contact";
  const pitchContactLabels = {
    ...messages.contact,
    cta: locale === "pt-br" ? "Enviar contato investidor" : "Send investor contact",
    fields: {
      ...messages.contact.fields,
      company: locale === "pt-br" ? "Fundo ou empresa" : "Fund or firm",
      message:
        locale === "pt-br"
          ? "Contexto da conversa"
          : "Conversation context",
    },
    placeholders: {
      ...messages.contact.placeholders,
      company:
        locale === "pt-br"
          ? "Fundo, family office ou empresa"
          : "Fund, family office, or company",
      message:
        locale === "pt-br"
          ? "Compartilhe seu perfil investidor, tese, dúvidas sobre a rodada ou próximos passos para uma conversa."
          : "Share your investor profile, thesis, questions about the round, or next steps for a conversation.",
    },
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)]">
      <DynamicBackground />

      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[#091017]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-5 px-5 py-3 lg:px-8">
          <Link href={`/${locale}`} className="inline-flex items-center">
            <Image
              src="/branding/yoten-logo.png"
              alt={messages.header.brand}
              width={300}
              height={76}
              priority
              className="h-6 w-auto sm:h-7"
            />
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href={`/${locale}`}
              className="hidden rounded-sm border border-[var(--border)] px-4 py-2 text-[10px] font-semibold uppercase text-[var(--muted)] hover:border-[var(--accent-cyan)] hover:text-white sm:inline-flex"
            >
              {pitchDeck.header.back}
            </Link>
            <LanguageSwitcher
              locale={locale}
              labels={messages.header.languageSwitcher}
            />
            <a
              href={`#${contactSectionId}`}
              className="rounded-sm bg-[var(--accent-cyan)] px-4 py-2 text-[10px] font-semibold uppercase text-[#031014] hover:translate-y-[-1px]"
            >
              {pitchDeck.header.cta}
            </a>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 pb-16 lg:px-8">
        <section className="grid min-h-[680px] gap-12 pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.72fr)] lg:items-center">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-sm bg-[rgba(107,243,255,0.08)] px-2 py-1 font-mono text-[10px] uppercase text-[var(--accent-cyan)]">
              <span className="h-1.5 w-1.5 bg-[var(--accent-purple)]" />
              {pitchDeck.hero.eyebrow}
            </div>
            <h1 className="max-w-4xl text-balance text-5xl font-bold leading-[0.98] text-white sm:text-6xl lg:text-[4.35rem]">
              {pitchDeck.hero.title}
            </h1>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              {pitchDeck.hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={`#${contactSectionId}`}
                className="inline-flex items-center justify-center rounded-sm bg-[var(--accent-cyan)] px-6 py-3 text-xs font-semibold text-[#031014] hover:translate-y-[-1px]"
              >
                {pitchDeck.hero.primaryCta}
              </a>
              <a
                href="#problem"
                className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] bg-[#0d151d]/70 px-6 py-3 text-xs font-semibold text-white hover:border-[var(--accent-cyan)]"
              >
                {pitchDeck.hero.secondaryCta}
              </a>
            </div>
          </div>

          <aside className="rounded-sm border border-[var(--border)] bg-[var(--surface-low)] p-6">
            <p className="font-mono text-[10px] uppercase text-[var(--accent-purple)]">
              {pitchDeck.hero.panelLabel}
            </p>
            <div className="mt-8 grid gap-4">
              {pitchDeck.hero.signals.map((signal) => (
                <div key={signal.value} className="border-l border-[var(--border)] pl-4">
                  <p className="text-2xl font-semibold text-white">{signal.value}</p>
                  <p className="mt-2 text-xs leading-6 text-[var(--muted)]">
                    {signal.label}
                  </p>
                </div>
              ))}
            </div>
          </aside>
        </section>

        <div className="grid gap-6">
          {slides.map((slide, index) => (
            <section
              key={slide.id}
              id={slide.id}
              className="scroll-mt-24 rounded-sm bg-[var(--surface-low)] p-7 md:p-10"
              aria-labelledby={`${slide.id}-title`}
            >
              <div className="grid gap-8 lg:grid-cols-[minmax(220px,0.38fr)_minmax(0,1fr)]">
                <div>
                  <p className="font-mono text-[10px] uppercase text-[var(--muted-dim)]">
                    {String(index + 2).padStart(2, "0")}
                    {" // "}
                    {slide.kicker}
                  </p>
                  <h2
                    id={`${slide.id}-title`}
                    className="mt-4 max-w-xl text-3xl font-semibold text-white md:text-4xl"
                  >
                    {slide.title}
                  </h2>
                </div>

                <div>
                  {slide.description ? (
                    <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
                      {slide.description}
                    </p>
                  ) : null}

                  {slide.points ? (
                    <ul className="mt-8 grid gap-3 md:grid-cols-2">
                      {slide.points.map((point) => (
                        <li
                          key={point}
                          className="rounded-sm border border-[var(--border)] bg-[#0b1117]/70 px-4 py-3 text-sm leading-6 text-white/86"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  ) : null}

                  {slide.groups ? (
                    <div className="mt-8 grid gap-4 md:grid-cols-2">
                      {slide.groups.map((group) => (
                        <article
                          key={group.title}
                          className="rounded-sm border border-[var(--border)] bg-[#0b1117]/70 p-5"
                        >
                          <h3 className="text-xl font-semibold text-white">{group.title}</h3>
                          <ul className="mt-5 grid gap-2">
                            {group.points.map((point) => (
                              <li
                                key={point}
                                className="border-l border-[var(--border)] pl-3 text-sm leading-6 text-white/86"
                              >
                                {point}
                              </li>
                            ))}
                          </ul>
                        </article>
                      ))}
                    </div>
                  ) : null}

                  {slide.table ? (
                    <div className="mt-8 overflow-hidden rounded-sm border border-[var(--border)]">
                      <table className="w-full border-collapse text-left text-sm">
                        <thead className="bg-[#0b1117]/80 text-white">
                          <tr>
                            {slide.table.headers.map((header) => (
                              <th key={header} className="px-4 py-3 font-semibold">
                                {header}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {slide.table.rows.map(([category, limitation]) => (
                            <tr key={category} className="border-t border-[var(--border)]">
                              <td className="px-4 py-3 text-white/86">{category}</td>
                              <td className="px-4 py-3 text-[var(--muted)]">{limitation}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : null}

                  {slide.callout ? (
                    <p className="mt-8 border-l border-[var(--accent-cyan)] bg-[rgba(107,243,255,0.08)] px-4 py-3 text-sm font-semibold leading-6 text-white">
                      {slide.callout}
                    </p>
                  ) : null}
                </div>
              </div>
            </section>
          ))}
        </div>

        <section
          id={contactSectionId}
          className="scroll-mt-24 py-16"
          aria-labelledby="pitch-contact-title"
        >
          <ContactForm
            titleId="pitch-contact-title"
            title={pitchDeck.cta.kicker}
            description={pitchDeck.cta.description}
            labels={pitchContactLabels}
            protocolSteps={
              locale === "pt-br"
                ? ["Contexto investidor Sanu", "Resposta direta dos founders"]
                : ["Sanu investor context", "Direct founder response"]
            }
          />
        </section>
      </div>
    </main>
  );
}
