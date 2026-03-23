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

function createNonce() {
  return btoa(crypto.randomUUID());
}

function buildContentSecurityPolicy(nonce: string) {
  return [
    "default-src 'self'",
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic' https://static.cloudflareinsights.com`,
    `style-src 'self' 'nonce-${nonce}'`,
    "img-src 'self' data: blob:",
    "font-src 'self'",
    "connect-src 'self' https://cloudflareinsights.com",
    "media-src 'self'",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'",
    "upgrade-insecure-requests",
  ].join("; ");
}

function withSecurityHeaders(
  request: NextRequest,
  nonce = createNonce(),
) {
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);
  const requestHeaders = new Headers(request.headers);

  requestHeaders.set("x-nonce", nonce);
  requestHeaders.set("Content-Security-Policy", contentSecurityPolicy);
  const response = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });

  response.headers.set("x-nonce", nonce);
  response.headers.set("Content-Security-Policy", contentSecurityPolicy);

  return response;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathnameHasLocale(pathname)) {
    return withSecurityHeaders(request);
  }

  const locale = resolvePreferredLocale({
    cookieLocale: request.cookies.get(localeCookieName)?.value,
    acceptLanguage: request.headers.get("accept-language"),
  });

  const redirectUrl = request.nextUrl.clone();
  redirectUrl.pathname = buildLocalizedPathname(pathname, locale);

  const redirectResponse = NextResponse.redirect(redirectUrl);
  const nonce = createNonce();
  const contentSecurityPolicy = buildContentSecurityPolicy(nonce);

  redirectResponse.headers.set("x-nonce", nonce);
  redirectResponse.headers.set("Content-Security-Policy", contentSecurityPolicy);

  return redirectResponse;
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|og.png|.*\\..*).*)",
  ],
};
