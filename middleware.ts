import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

import { isValidLocale } from "@/i18n/config";
import {
  localeCookieName,
  resolvePreferredLocale,
} from "@/i18n/detect-locale";

function pathnameHasLocale(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  return segments.length > 0 && isValidLocale(segments[0]);
}

function buildLocalizedPathname(pathname: string, locale: string) {
  if (pathname === "/") {
    return `/${locale}`;
  }

  return `/${locale}${pathname}`;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathnameHasLocale(pathname)) {
    return NextResponse.next();
  }

  const locale = resolvePreferredLocale({
    cookieLocale: request.cookies.get(localeCookieName)?.value,
    acceptLanguage: request.headers.get("accept-language"),
  });

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = buildLocalizedPathname(pathname, locale);

  return NextResponse.redirect(redirectUrl);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|og.png|.*\\..*).*)",
  ],
};
