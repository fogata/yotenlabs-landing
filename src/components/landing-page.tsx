import Link from "next/link";

import { DynamicBackground } from "@/components/dynamic-background";
import { LanguageSwitcher } from "@/components/language-switcher";
import type { Locale } from "@/i18n/config";
import type { Messages } from "@/i18n/get-messages";

type LandingPageProps = {
  locale: Locale;
  messages: Messages;
};

const sectionIds = {
  whatWeDo: "what-we-do",
  howWeWork: "how-we-work",
  projects: "projects",
  faq: "faq",
  contact: "contact",
} as const;

export function LandingPage({ locale, messages }: LandingPageProps) {
  const navItems = [
    { id: sectionIds.whatWeDo, label: messages.header.nav.whatWeDo },
    { id: sectionIds.howWeWork, label: messages.header.nav.howWeWork },
    { id: sectionIds.projects, label: messages.header.nav.projects },
    { id: sectionIds.faq, label: messages.header.nav.faq },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden">
      <DynamicBackground />

      <header className="sticky top-0 z-30 border-b border-white/10 bg-zinc-950/72 backdrop-blur-md">
        <div className="mx-auto max-w-6xl px-6 py-4 lg:px-8">
          <div className="flex items-center justify-between gap-6">
            <Link
              href={`/${locale}`}
              className="text-sm font-semibold uppercase tracking-[0.28em] text-white"
            >
              {messages.header.brand}
            </Link>

            <div className="hidden items-center gap-8 text-sm text-zinc-300 md:flex">
              <nav className="flex items-center gap-6">
                {navItems.map((item) => (
                  <a key={item.id} href={`#${item.id}`} className="hover:text-white">
                    {item.label}
                  </a>
                ))}
              </nav>
              <a
                href={`#${sectionIds.contact}`}
                className="rounded-full border border-white/15 px-4 py-2 text-white hover:border-white/35 hover:bg-white/5"
              >
                {messages.header.cta}
              </a>
              <LanguageSwitcher
                locale={locale}
                labels={messages.header.languageSwitcher}
              />
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <a
                href={`#${sectionIds.contact}`}
                className="rounded-full border border-white/15 px-4 py-2 text-xs font-medium uppercase tracking-[0.16em] text-white"
              >
                {messages.header.cta}
              </a>
              <LanguageSwitcher
                locale={locale}
                labels={messages.header.languageSwitcher}
              />
            </div>
          </div>

          <nav className="mt-4 flex gap-4 overflow-x-auto pb-1 text-xs uppercase tracking-[0.18em] text-zinc-400 md:hidden">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="whitespace-nowrap rounded-full border border-white/10 px-3 py-2 hover:border-white/20 hover:text-white"
              >
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col gap-24 px-6 pb-16 pt-16 lg:px-8 lg:pb-24 lg:pt-24">
        <section className="grid gap-14 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)] lg:items-end">
          <div className="space-y-8">
            <p className="font-mono text-xs uppercase tracking-[0.32em] text-zinc-400">
              {messages.hero.eyebrow}
            </p>
            <div className="space-y-6">
              <h1 className="max-w-4xl text-balance text-5xl font-semibold tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                {messages.hero.title}
              </h1>
              <p className="max-w-3xl text-balance text-lg leading-8 text-zinc-300 sm:text-xl">
                {messages.hero.description}
              </p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href={`#${sectionIds.contact}`}
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:translate-y-[-1px] hover:bg-zinc-100"
              >
                {messages.hero.primaryCta}
              </a>
              <a
                href={`#${sectionIds.howWeWork}`}
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm font-semibold text-white hover:border-white/35 hover:bg-white/5"
              >
                {messages.hero.secondaryCta}
              </a>
            </div>
          </div>

          <div className="rounded-[2rem] border border-white/10 bg-white/[0.04] p-8 shadow-[0_0_0_1px_rgba(255,255,255,0.03)]">
            <div className="space-y-8">
              <div className="space-y-3">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
                  {messages.hero.panel.label}
                </p>
                <p className="text-lg leading-8 text-zinc-200">
                  {messages.hero.panel.description}
                </p>
              </div>
              <ul className="grid gap-4 sm:grid-cols-2">
                {messages.hero.panel.metrics.map((metric) => (
                  <li
                    key={metric.label}
                    className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                  >
                    <p className="text-2xl font-semibold tracking-[-0.03em] text-white">
                      {metric.value}
                    </p>
                    <p className="mt-2 text-sm leading-6 text-zinc-400">
                      {metric.label}
                    </p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <section aria-label={messages.yoten.label} className="-mt-10">
          <div className="inline-flex max-w-3xl items-start gap-3 rounded-full border border-white/10 bg-white/[0.03] px-5 py-3 text-sm leading-6 text-zinc-300">
            <span className="font-mono text-[11px] uppercase tracking-[0.28em] text-zinc-500">
              {messages.yoten.label}
            </span>
            <p>{messages.yoten.description}</p>
          </div>
        </section>

        <section
          id={sectionIds.whatWeDo}
          className="space-y-8 scroll-mt-28"
          aria-labelledby="what-we-do-title"
        >
          <div className="max-w-3xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
              {messages.whatWeDo.kicker}
            </p>
            <h2
              id="what-we-do-title"
              className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl"
            >
              {messages.whatWeDo.title}
            </h2>
            <p className="text-base leading-7 text-zinc-400 sm:text-lg">
              {messages.whatWeDo.description}
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {messages.whatWeDo.items.map((item) => (
              <article
                key={item.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <h3 className="text-lg font-semibold text-white">{item.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id={sectionIds.howWeWork}
          className="space-y-8 scroll-mt-28"
          aria-labelledby="how-we-work-title"
        >
          <div className="max-w-3xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
              {messages.howWeWork.kicker}
            </p>
            <h2
              id="how-we-work-title"
              className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl"
            >
              {messages.howWeWork.title}
            </h2>
            <p className="text-base leading-7 text-zinc-400 sm:text-lg">
              {messages.howWeWork.description}
            </p>
          </div>
          <ol className="grid gap-4 lg:grid-cols-4">
            {messages.howWeWork.steps.map((step, index) => (
              <li
                key={step.title}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
                  {String(index + 1).padStart(2, "0")}
                </p>
                <h3 className="mt-4 text-lg font-semibold text-white">{step.title}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {step.description}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section
          id={sectionIds.projects}
          className="space-y-8 scroll-mt-28"
          aria-labelledby="projects-title"
        >
          <div className="max-w-3xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
              {messages.projects.kicker}
            </p>
            <h2
              id="projects-title"
              className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl"
            >
              {messages.projects.title}
            </h2>
            <p className="text-base leading-7 text-zinc-400 sm:text-lg">
              {messages.projects.description}
            </p>
          </div>
          <div className="grid gap-4 lg:grid-cols-2">
            {messages.projects.cards.map((project) => (
              <article
                key={project.name}
                className="flex h-full flex-col rounded-[1.85rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-2xl font-semibold tracking-[-0.03em] text-white">
                      {project.name}
                    </h3>
                    <p className="mt-2 text-sm font-medium uppercase tracking-[0.18em] text-zinc-400">
                      {project.tagline}
                    </p>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/[0.06] px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-200">
                    {project.status}
                  </span>
                </div>
                <p className="mt-5 text-sm leading-7 text-zinc-400 sm:text-base">
                  {project.description}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-white/10 px-3 py-1 text-xs text-zinc-300"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </section>

        <section
          id={sectionIds.faq}
          className="space-y-8 scroll-mt-28"
          aria-labelledby="faq-title"
        >
          <div className="max-w-3xl space-y-3">
            <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
              {messages.faq.kicker}
            </p>
            <h2
              id="faq-title"
              className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl"
            >
              {messages.faq.title}
            </h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {messages.faq.items.map((item) => (
              <article
                key={item.question}
                className="rounded-[1.75rem] border border-white/10 bg-white/[0.04] p-6"
              >
                <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                <p className="mt-3 text-sm leading-7 text-zinc-400">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id={sectionIds.contact}
          className="scroll-mt-28"
          aria-labelledby="contact-title"
        >
          <div className="rounded-[2rem] border border-white/10 bg-white/[0.05] px-6 py-10 sm:px-8 lg:px-10">
            <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-2xl space-y-4">
                <p className="font-mono text-xs uppercase tracking-[0.28em] text-zinc-500">
                  {messages.contact.kicker}
                </p>
                <h2
                  id="contact-title"
                  className="text-3xl font-semibold tracking-[-0.04em] text-white sm:text-4xl"
                >
                  {messages.contact.title}
                </h2>
                <p className="text-base leading-7 text-zinc-400 sm:text-lg">
                  {messages.contact.description}
                </p>
              </div>
              <a
                href="mailto:hello@yotenlabs.ai"
                className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-zinc-950 hover:translate-y-[-1px] hover:bg-zinc-100"
              >
                {messages.contact.cta}
              </a>
            </div>
          </div>
        </section>
      </div>

      <footer className="border-t border-white/10">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p>{messages.footer.tagline}</p>
          <p>{messages.footer.copyright}</p>
        </div>
      </footer>
    </main>
  );
}
