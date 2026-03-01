"use client";

import { useEffect } from "react";

import type { Locale } from "@/i18n/config";

type HtmlLangProps = {
  locale: Locale;
};

const htmlLanguageMap: Record<Locale, string> = {
  en: "en-US",
  "pt-br": "pt-BR",
};

export function HtmlLang({ locale }: HtmlLangProps) {
  useEffect(() => {
    document.documentElement.lang = htmlLanguageMap[locale];
  }, [locale]);

  return null;
}
