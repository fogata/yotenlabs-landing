import Image from "next/image";
import Link from "next/link";

import { ContactForm } from "@/components/contact-form";
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
  const heroTitleParts = messages.hero.title.split("AI-native");
  const navItems = [
    { id: sectionIds.whatWeDo, label: messages.header.nav.whatWeDo },
    { id: sectionIds.howWeWork, label: messages.header.nav.howWeWork },
    { id: sectionIds.projects, label: messages.header.nav.projects },
    { id: sectionIds.faq, label: messages.header.nav.faq },
  ];

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--background)]">
      <DynamicBackground />

      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[#091017]/92 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-5 py-3 lg:px-8">
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

          <div className="hidden items-center gap-8 text-[11px] font-medium text-[var(--muted)] md:flex">
            <nav className="flex items-center gap-8">
              {navItems.map((item) => (
                <a key={item.id} href={`#${item.id}`} className="hover:text-white">
                  {item.label}
                </a>
              ))}
            </nav>
            <LanguageSwitcher
              locale={locale}
              labels={messages.header.languageSwitcher}
            />
            <a
              href={`#${sectionIds.contact}`}
              className="rounded-sm bg-[var(--accent-cyan)] px-5 py-2 text-[11px] font-semibold text-[#031014] hover:translate-y-[-1px]"
            >
              {messages.header.cta}
            </a>
          </div>

          <div className="flex items-center gap-2 md:hidden">
            <LanguageSwitcher
              locale={locale}
              labels={messages.header.languageSwitcher}
            />
            <a
              href={`#${sectionIds.contact}`}
              className="rounded-sm bg-[var(--accent-cyan)] px-3 py-2 text-[10px] font-semibold uppercase text-[#031014]"
            >
              {messages.header.cta}
            </a>
          </div>
        </div>

        <nav className="mx-auto flex max-w-7xl gap-3 overflow-x-auto px-5 pb-3 text-[10px] uppercase text-[var(--muted)] md:hidden">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={`#${item.id}`}
              className="whitespace-nowrap rounded-sm bg-[var(--surface-low)] px-3 py-2 hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </nav>
      </header>

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col px-5 pb-16 lg:px-8">
        <section className="grid min-h-[720px] gap-14 pt-32 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.78fr)] lg:items-center lg:pt-24">
          <div>
            <div className="mb-8 inline-flex items-center gap-2 rounded-sm bg-[rgba(107,243,255,0.08)] px-2 py-1 font-mono text-[10px] uppercase text-[var(--accent-cyan)]">
              <span className="h-1.5 w-1.5 bg-[var(--accent-purple)]" />
              {messages.hero.eyebrow}
            </div>
            <h1 className="max-w-3xl text-balance text-5xl font-bold leading-[0.98] text-white sm:text-6xl lg:text-[4.35rem]">
              {heroTitleParts.length > 1 ? (
                <>
                  {heroTitleParts[0]}
                  <span className="text-[var(--accent-cyan)]">AI-native</span>
                  {heroTitleParts.slice(1).join("AI-native")}
                </>
              ) : (
                messages.hero.title
              )}
            </h1>
            <p className="mt-8 max-w-2xl text-sm leading-7 text-[var(--muted)] sm:text-base">
              {messages.hero.description}
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <a
                href={`#${sectionIds.contact}`}
                className="inline-flex items-center justify-center rounded-sm bg-[var(--accent-cyan)] px-6 py-3 text-xs font-semibold text-[#031014] hover:translate-y-[-1px]"
              >
                {messages.hero.primaryCta}
              </a>
              <a
                href={`#${sectionIds.whatWeDo}`}
                className="inline-flex items-center justify-center rounded-sm border border-[var(--border)] bg-[#0d151d]/70 px-6 py-3 text-xs font-semibold text-white hover:border-[var(--accent-cyan)]"
              >
                {messages.hero.secondaryCta}
              </a>
            </div>

            <ul className="mt-14 grid max-w-xl grid-cols-2 gap-10">
              {messages.hero.panel.metrics.slice(0, 2).map((metric) => (
                <li key={metric.label}>
                  <p className="text-xl font-semibold text-white">{metric.value}</p>
                  <p className="mt-2 font-mono text-[10px] uppercase text-[var(--muted-dim)]">
                    {metric.label}
                  </p>
                </li>
              ))}
            </ul>
          </div>

          <div className="relative min-h-[360px]">
            <div className="absolute right-0 top-4 w-full max-w-[490px] rounded-sm bg-[var(--surface-low)] p-9">
              <div className="relative aspect-square overflow-hidden bg-black">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.78),rgba(107,243,255,0.18)_18%,rgba(255,255,255,0.05)_31%,transparent_48%)]" />
                <div className="absolute inset-8 rounded-full border border-white/5 bg-[conic-gradient(from_45deg,transparent,rgba(255,255,255,0.22),transparent,rgba(107,243,255,0.22),transparent)] blur-sm" />
                <div className="absolute inset-20 rounded-full border border-[var(--accent-cyan)]/20 blur-md" />
                <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.035)_1px,transparent_1px),linear-gradient(180deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:24px_24px]" />
              </div>
            </div>
            <div className="absolute bottom-0 left-0 w-52 rounded-sm border border-[var(--border)] bg-[#161d26] p-4 font-mono text-[10px] text-[var(--muted)] shadow-[0_18px_50px_rgba(0,0,0,0.28)]">
              <div className="mb-3 h-4 w-4 border border-[var(--accent-cyan)] p-[3px]">
                <div className="h-full w-full bg-[var(--accent-cyan)]" />
              </div>
              <p>system initialized</p>
              <p>kernel protocols for speed optimization...</p>
            </div>
          </div>
        </section>

        <section
          id={sectionIds.whatWeDo}
          className="scroll-mt-24 py-24"
          aria-labelledby="what-we-do-title"
        >
          <div className="mb-12 flex items-end justify-between gap-8">
            <div className="max-w-3xl">
              <h2 id="what-we-do-title" className="text-4xl font-semibold text-white">
                {messages.whatWeDo.title}
              </h2>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--muted)]">
                {messages.whatWeDo.description}
              </p>
            </div>
            <span className="hidden rounded-sm border border-[var(--border)] px-3 py-1 font-mono text-[10px] uppercase text-[var(--muted)] md:inline-flex">
              01 // Services
            </span>
          </div>

          <div className="grid gap-6 lg:grid-cols-3">
            {messages.whatWeDo.items.map((item, index) => (
              <article
                key={item.title}
                className={`rounded-sm bg-[var(--surface-low)] p-7 transition hover:bg-[var(--surface-high)] ${
                  index === 0 ? "lg:col-span-2" : ""
                } ${index === 1 ? "border-t-2 border-[var(--accent-purple)]" : ""}`}
              >
                <div className="mb-8 flex items-start justify-between">
                  <span className="grid h-8 w-8 place-items-center rounded-sm bg-[rgba(107,243,255,0.12)] font-mono text-[11px] text-[var(--accent-cyan)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  {index === 0 ? (
                    <div className="hidden translate-y-6 gap-2 opacity-25 sm:flex">
                      {[0, 1, 2, 3, 4].map((dot) => (
                        <span key={dot} className="h-5 w-5 rounded-full bg-[var(--muted)]" />
                      ))}
                    </div>
                  ) : null}
                </div>
                <h3 className="text-xl font-semibold text-white">{item.title}</h3>
                <p className="mt-4 max-w-xl text-sm leading-7 text-[var(--muted)]">
                  {item.description}
                </p>
                <div className="mt-7 flex flex-wrap gap-2">
                  {["microservices", "node runtime", "CI/CD"].map((tag) => (
                    <span
                      key={tag}
                      className="rounded-sm bg-[#0b1117] px-2 py-1 font-mono text-[9px] uppercase text-[var(--muted-dim)]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </article>
            ))}
          </div>
        </section>

        <section
          id={sectionIds.howWeWork}
          className="scroll-mt-24 border-y border-[var(--border)] bg-[#070c12]/72 py-24"
          aria-labelledby="how-we-work-title"
        >
          <div className="mx-auto max-w-5xl px-4 text-center">
            <p className="font-mono text-[10px] uppercase text-[var(--accent-cyan)]">
              {messages.howWeWork.kicker}
            </p>
            <h2 id="how-we-work-title" className="mt-4 text-4xl font-semibold text-white">
              {messages.howWeWork.title}
            </h2>
          </div>
          <ol className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {messages.howWeWork.steps.map((step, index) => (
              <li key={step.title} className="relative">
                <span className="mb-5 inline-flex h-4 w-4 rounded-full bg-[var(--surface-high)]" />
                <h3 className="text-base font-semibold text-white">{step.title}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  {step.description}
                </p>
                <p className="mt-5 font-mono text-[10px] text-[var(--muted-dim)]">
                  0{index + 1}
                </p>
              </li>
            ))}
          </ol>
        </section>

        <section aria-label={messages.yoten.label} className="grid gap-16 bg-[#101725] px-6 py-28 lg:grid-cols-[minmax(0,0.95fr)_minmax(420px,1.05fr)] lg:items-center lg:px-8">
          <div>
            <p className="text-2xl font-black uppercase italic text-white">
              {locale === "pt-br" ? "Quem somos." : "Who we are."}
            </p>
            <p className="mt-8 max-w-xl text-sm leading-7 text-white/80">
              {messages.hero.panel.description}
            </p>
            <p className="mt-5 max-w-xl text-xs leading-6 text-[var(--muted)]">
              {messages.yoten.description}
            </p>
            <div className="mt-10 grid max-w-sm grid-cols-2 gap-8">
              <div>
                <p className="text-4xl font-black text-[var(--accent-cyan)]">150+</p>
                <p className="mt-2 font-mono text-[9px] uppercase text-[var(--muted-dim)]">
                  AI assets launched
                </p>
              </div>
              <div>
                <p className="text-4xl font-black text-[var(--accent-purple)]">40+</p>
                <p className="mt-2 font-mono text-[9px] uppercase text-[var(--muted-dim)]">
                  AI systems shipped
                </p>
              </div>
            </div>
          </div>

          <div className="relative min-h-[330px] border border-[#2a3341] bg-black">
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(107,243,255,0.08)_1px,transparent_1px),linear-gradient(180deg,rgba(107,243,255,0.06)_1px,transparent_1px)] bg-[size:18px_18px]" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.55),rgba(107,243,255,0.24)_10%,rgba(124,60,255,0.16)_20%,transparent_44%)]" />
            <div className="absolute inset-10 bg-[conic-gradient(from_90deg,transparent,rgba(255,255,255,0.4),transparent,rgba(107,243,255,0.35),transparent)] blur-sm" />
            <div className="absolute bottom-4 right-4 rounded-sm bg-[#071018] px-3 py-2 font-mono text-[8px] uppercase text-white">
              System status: nominal
            </div>
          </div>
        </section>

        <section
          id={sectionIds.projects}
          className="scroll-mt-24 py-24"
          aria-labelledby="projects-title"
        >
          <div className="mb-12 max-w-3xl">
            <p className="font-mono text-[10px] uppercase text-[var(--accent-purple)]">
              {messages.projects.kicker}
            </p>
            <h2 id="projects-title" className="mt-4 text-4xl font-semibold text-white">
              {messages.projects.title}
            </h2>
            <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
              {messages.projects.description}
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

        <section
          id={sectionIds.faq}
          className="scroll-mt-24 py-24"
          aria-labelledby="faq-title"
        >
          <div className="mb-12 max-w-3xl">
            <p className="font-mono text-[10px] uppercase text-[var(--accent-cyan)]">
              {messages.faq.kicker}
            </p>
            <h2 id="faq-title" className="mt-4 text-4xl font-semibold text-white">
              {messages.faq.title}
            </h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {messages.faq.items.map((item) => (
              <article key={item.question} className="rounded-sm bg-[var(--surface-low)] p-7">
                <h3 className="text-lg font-semibold text-white">{item.question}</h3>
                <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                  {item.answer}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id={sectionIds.contact}
          className="scroll-mt-24 py-24"
          aria-labelledby="contact-title"
        >
          <ContactForm
            titleId="contact-title"
            title={locale === "pt-br" ? "Inicializar protocolo." : "Initialize protocol."}
            description={messages.contact.description}
            labels={messages.contact}
            protocolSteps={
              locale === "pt-br"
                ? ["Prontidão de deploy imediato", "Auditoria arquitetural inclusa"]
                : ["Immediate deployment readiness", "Architectural audit included"]
            }
          />
        </section>
      </div>

      <footer className="border-t border-[var(--border)] bg-[#070c12]">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-5 py-8 text-[10px] uppercase text-[var(--muted-dim)] sm:flex-row sm:items-center sm:justify-between lg:px-8">
          <p className="font-semibold text-white">{messages.header.brand}</p>
          <p>{messages.footer.tagline}</p>
          <p>{messages.footer.copyright}</p>
        </div>
      </footer>
    </main>
  );
}
