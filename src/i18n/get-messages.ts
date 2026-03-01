import type enMessages from "@/i18n/messages/en.json";

import type { Locale } from "@/i18n/config";

export type Messages = typeof enMessages;

const dictionaries: Record<Locale, () => Promise<Messages>> = {
  en: () => import("@/i18n/messages/en.json").then((module) => module.default),
  "pt-br": () =>
    import("@/i18n/messages/pt-br.json").then((module) => module.default),
};

export function getMessages(locale: Locale) {
  return dictionaries[locale]();
}
