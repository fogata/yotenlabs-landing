/** @vitest-environment node */

import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";

import { middleware } from "./middleware";

function createRequest(pathname: string, headers?: HeadersInit) {
  return new NextRequest(`https://yotenlabs.ai${pathname}`, {
    headers,
  });
}

describe("middleware", () => {
  it("redirects to pt-br when cookie preference is present", () => {
    const request = createRequest("/", {
      cookie: "yoten_locale=pt-br",
      "accept-language": "en-US,en;q=0.9",
    });

    const response = middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://yotenlabs.ai/pt-br");
    expect(response.headers.get("Content-Security-Policy")).toContain(
      "script-src 'self' 'nonce-",
    );
  });

  it("redirects to pt-br from accept-language when no cookie is set", () => {
    const request = createRequest("/", {
      "accept-language": "pt-BR,pt;q=0.9,en;q=0.8",
    });

    const response = middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://yotenlabs.ai/pt-br");
  });

  it("redirects to en from accept-language when browser prefers english", () => {
    const request = createRequest("/", {
      "accept-language": "en-US,en;q=0.9,pt-BR;q=0.7",
    });

    const response = middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get("location")).toBe("https://yotenlabs.ai/en");
  });

  it("adds a nonce-based CSP when the locale is already present", () => {
    const request = createRequest("/pt-br");

    const response = middleware(request);
    const contentSecurityPolicy = response.headers.get("Content-Security-Policy");

    expect(response.status).toBe(200);
    expect(response.headers.get("x-nonce")).toBeTruthy();
    expect(contentSecurityPolicy).toContain("default-src 'self'");
    expect(contentSecurityPolicy).toContain("script-src 'self' 'nonce-");
    expect(contentSecurityPolicy).toContain("https://static.cloudflareinsights.com");
  });
});
