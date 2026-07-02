import { afterEach, describe, expect, it, vi } from "vitest";
import type { NextRequest } from "next/server";
import { isAuthorized } from "../lib/auth";

function reqWith(auth?: string): NextRequest {
  return {
    headers: { get: (k: string) => (k === "authorization" ? auth ?? null : null) },
  } as unknown as NextRequest;
}

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("protected state API authorization", () => {
  it("rejects missing/wrong token when a token is configured", () => {
    vi.stubEnv("DEMO_OPERATOR_TOKEN", "secret-token");
    expect(isAuthorized(reqWith(undefined))).toBe(false);
    expect(isAuthorized(reqWith("Bearer wrong"))).toBe(false);
  });

  it("accepts the correct bearer token", () => {
    vi.stubEnv("DEMO_OPERATOR_TOKEN", "secret-token");
    expect(isAuthorized(reqWith("Bearer secret-token"))).toBe(true);
  });

  it("is open for local read-only use when no token configured", () => {
    vi.stubEnv("DEMO_OPERATOR_TOKEN", "");
    expect(isAuthorized(reqWith(undefined))).toBe(true);
  });
});