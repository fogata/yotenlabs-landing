import { describe, expect, it } from "vitest";

import {
  detectLocaleFromAcceptLanguage,
  normalizeLocale,
  resolvePreferredLocale,
} from "@/i18n/detect-locale";

describe("detect locale", () => {
  it("normalizes supported locale values", () => {
    expect(normalizeLocale("pt-BR")).toBe("pt-br");
    expect(normalizeLocale("en-US")).toBe("en");
    expect(normalizeLocale("fr-FR")).toBeNull();
  });

  it("detects pt-br from accept-language header", () => {
    expect(detectLocaleFromAcceptLanguage("pt-BR,pt;q=0.9,en;q=0.8")).toBe(
      "pt-br",
    );
  });

  it("falls back to en when header is missing or unsupported", () => {
    expect(detectLocaleFromAcceptLanguage()).toBe("en");
    expect(detectLocaleFromAcceptLanguage("fr-FR,es;q=0.9")).toBe("en");
  });

  it("prefers a valid cookie locale over accept-language", () => {
    expect(
      resolvePreferredLocale({
        cookieLocale: "pt-br",
        acceptLanguage: "en-US,en;q=0.9",
      }),
    ).toBe("pt-br");
  });
});
