import { defaultLocale, isValidLocale, type Locale } from "@/i18n/config";

export const localeCookieName = "yoten_locale";
export const localeCookieMaxAge = 60 * 60 * 24 * 180;

export function setLocaleCookie(locale: Locale) {
  document.cookie =
    `${localeCookieName}=${locale}; path=/; max-age=${localeCookieMaxAge}; ` +
    "samesite=lax";
}

export function normalizeLocale(input?: string | null): Locale | null {
  if (!input) {
    return null;
  }

  const normalized = input.trim().toLowerCase();

  if (isValidLocale(normalized)) {
    return normalized;
  }

  if (normalized.startsWith("pt")) {
    return "pt-br";
  }

  if (normalized.startsWith("en")) {
    return "en";
  }

  return null;
}

type LanguagePreference = {
  locale: Locale;
  quality: number;
  index: number;
};

export function detectLocaleFromAcceptLanguage(
  header?: string | null,
): Locale {
  if (!header) {
    return defaultLocale;
  }

  const preferences = header
    .split(",")
    .map((entry, index) => {
      const [languageRange, ...params] = entry.trim().split(";");
      const locale = normalizeLocale(languageRange);

      if (!locale) {
        return null;
      }

      const qualityParam = params.find((param) => param.trim().startsWith("q="));
      const quality = qualityParam
        ? Number.parseFloat(qualityParam.trim().slice(2))
        : 1;

      const preference: LanguagePreference = {
        locale,
        quality: Number.isFinite(quality) ? quality : 0,
        index,
      };

      return preference;
    })
    .filter((preference): preference is LanguagePreference => preference !== null)
    .sort((left, right) => {
      if (right.quality !== left.quality) {
        return right.quality - left.quality;
      }

      return left.index - right.index;
    });

  return preferences[0]?.locale ?? defaultLocale;
}

type ResolvePreferredLocaleOptions = {
  cookieLocale?: string | null;
  acceptLanguage?: string | null;
};

export function resolvePreferredLocale({
  cookieLocale,
  acceptLanguage,
}: ResolvePreferredLocaleOptions): Locale {
  const preferredFromCookie = normalizeLocale(cookieLocale);

  if (preferredFromCookie) {
    return preferredFromCookie;
  }

  return detectLocaleFromAcceptLanguage(acceptLanguage);
}
