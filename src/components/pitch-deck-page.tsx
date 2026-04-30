import Image from "next/image";
import Link from "next/link";

import { DynamicBackground } from "@/components/dynamic-background";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/get-messages";

type PitchDeckPageProps = {
  locale: Locale;
  messages: Messages;
};

const deckSections = [
  "problem",
  "opportunity",
  "solution",
  "differentiation",
  "businessModel",
  "roadmap",
  "team",
] as const;

export function PitchDeckPage({ locale, messages }: PitchDeckPageProps) {
  const { pitchDeck } = messages;

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
              href={`/${locale}#contact`}
              className="rounded-sm bg-[var(--accent-cyan)] px-4 py-2 text-[10px] font-semibold uppercase text-[#031014] hover:translate-y-[-1px]"
            >
              {pitchDeck.header.cta}
            </a>
          </div>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 pb-16 lg:px-8">
        <section className="grid min-h-[680px] gap-12 pt-24 lg:grid-cols-[minmax(0,1fr)_minmax(340px,0.76fr)] lg:items-center">
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
                href={`/${locale}#contact`}
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
          {deckSections.map((sectionKey, index) => {
            const section = pitchDeck.sections[sectionKey];

            return (
              <section
                key={sectionKey}
                id={sectionKey}
                className="scroll-mt-24 rounded-sm bg-[var(--surface-low)] p-7 md:p-10"
                aria-labelledby={`${sectionKey}-title`}
              >
                <div className="grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)]">
                  <div>
                    <p className="font-mono text-[10px] uppercase text-[var(--muted-dim)]">
                      {String(index + 1).padStart(2, "0")}
                      {" // "}
                      {section.kicker}
                    </p>
                    <h2
                      id={`${sectionKey}-title`}
                      className="mt-4 text-3xl font-semibold text-white md:text-4xl"
                    >
                      {section.title}
                    </h2>
                  </div>
                  <div>
                    <p className="max-w-3xl text-sm leading-7 text-[var(--muted)]">
                      {section.description}
                    </p>
                    <ul className="mt-8 grid gap-3 md:grid-cols-2">
                      {section.points.map((point) => (
                        <li
                          key={point}
                          className="rounded-sm border border-[var(--border)] bg-[#0b1117]/70 px-4 py-3 text-sm leading-6 text-white/86"
                        >
                          {point}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </section>
            );
          })}
        </div>

        <section
          id="products"
          className="scroll-mt-24 py-24"
          aria-labelledby="products-title"
        >
          <div className="mb-12 max-w-3xl">
            <p className="font-mono text-[10px] uppercase text-[var(--accent-purple)]">
              {pitchDeck.products.kicker}
            </p>
            <h2 id="products-title" className="mt-4 text-4xl font-semibold text-white">
              {pitchDeck.products.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              {pitchDeck.products.description}
            </p>
          </div>
          <div className="grid gap-6 lg:grid-cols-3">
            {messages.projects.cards.map((project) => (
              <article key={project.name} className="rounded-sm bg-[var(--surface-low)] p-7">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="text-2xl font-semibold text-white">{project.name}</h3>
                  <span className="rounded-sm bg-[rgba(124,60,255,0.14)] px-2 py-1 font-mono text-[9px] uppercase text-[var(--accent-purple)]">
                    {project.status}
                  </span>
                </div>
                <p className="mt-3 font-mono text-[10px] uppercase text-[var(--muted-dim)]">
                  {project.tagline}
                </p>
                <p className="mt-6 text-sm leading-7 text-[var(--muted)]">
                  {project.description}
                </p>
                {project.url ? (
                  <a
                    href={project.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-6 inline-flex rounded-sm border border-[var(--border)] px-3 py-2 font-mono text-[10px] uppercase text-[var(--accent-cyan)] hover:border-[var(--accent-cyan)] hover:text-white"
                  >
                    {messages.projects.visitLabel}
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        </section>

        <section className="grid gap-10 bg-[#101725] px-6 py-16 md:px-10 lg:grid-cols-[minmax(0,0.9fr)_minmax(320px,0.6fr)] lg:items-center">
          <div>
            <p className="font-mono text-[10px] uppercase text-[var(--accent-cyan)]">
              {pitchDeck.cta.kicker}
            </p>
            <h2 className="mt-4 max-w-3xl text-4xl font-semibold text-white">
              {pitchDeck.cta.title}
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-[var(--muted)]">
              {pitchDeck.cta.description}
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <a
              href={`/${locale}#contact`}
              className="inline-flex items-center justify-center rounded-sm bg-[var(--accent-cyan)] px-6 py-3 text-xs font-semibold text-[#031014] hover:translate-y-[-1px]"
            >
              {pitchDeck.cta.primary}
            </a>
            <Link
              href={`/${locale}#contact`}
              className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] bg-[#0d151d]/70 px-6 py-3 text-xs font-semibold text-white hover:border-[var(--accent-cyan)]"
            >
              {pitchDeck.cta.secondary}
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
