"use client";

import { usePathname, useRouter } from "next/navigation";

import { localeLabels, replaceLocaleInPathname, type Locale } from "@/i18n/config";

type LanguageSwitcherProps = {
  locale: Locale;
};

export function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLocaleChange = (targetLocale: Locale) => {
    if (targetLocale === locale) {
      return;
    }

    const hash = window.location.hash;
    const nextPathname = replaceLocaleInPathname(pathname, targetLocale);

    router.push(`${nextPathname}${hash}`);
  };

  return (
    <div
      aria-label="Language switcher"
      className="inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 text-xs font-medium tracking-[0.2em] text-zinc-300"
    >
      {(Object.entries(localeLabels) as Array<[Locale, string]>).map(
        ([targetLocale, label]) => (
          <button
            key={targetLocale}
            type="button"
            aria-pressed={targetLocale === locale}
            onClick={() => handleLocaleChange(targetLocale)}
            className={`rounded-full px-3 py-2 ${
              targetLocale === locale
                ? "bg-white text-zinc-950"
                : "text-zinc-300 hover:text-white"
            }`}
          >
            {label}
          </button>
        ),
      )}
    </div>
  );
}
