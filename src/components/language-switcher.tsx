"use client";

import { usePathname, useRouter } from "next/navigation";

import { locales, replaceLocaleInPathname, type Locale } from "@/i18n/config";
import { setLocaleCookie } from "@/i18n/detect-locale";

type LanguageSwitcherProps = {
  locale: Locale;
  labels: Record<Locale, string>;
};

export function LanguageSwitcher({ locale, labels }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (targetLocale: Locale) => {
    if (targetLocale === locale) {
      return;
    }

    setLocaleCookie(targetLocale);

    const hash = window.location.hash;
    const nextPathname = replaceLocaleInPathname(pathname, targetLocale);

    router.push(`${nextPathname}${hash}`);
  };

  return (
    <div
      aria-label="Language switcher"
      className="inline-flex items-center gap-1 rounded-lg border border-[var(--border)] bg-white/5 p-1 text-xs font-medium text-zinc-300"
    >
      {locales.map((targetLocale) => (
        <button
          key={targetLocale}
          type="button"
          aria-pressed={targetLocale === locale}
          onClick={() => handleLocaleChange(targetLocale)}
          className={`rounded-lg px-3 py-2 ${
            targetLocale === locale
              ? "bg-[var(--primary)] text-[#001947]"
              : "text-zinc-300 hover:text-white"
          }`}
        >
          {labels[targetLocale]}
        </button>
      ))}
    </div>
  );
}
