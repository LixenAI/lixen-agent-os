import type { NextRequest } from "next/server";

/**
 * Server-only authorization for the protected state API.
 * In demo mode, requests must carry the operator bearer token.
 * The token lives only on the server (env) and is never sent to the client.
 */
export function isAuthorized(req: NextRequest): boolean {
  const expected = process.env.DEMO_OPERATOR_TOKEN;
  if (!expected) {
    // No token configured -> demo mode is open for local read-only use.
    return true;
  }
  const header = req.headers.get("authorization") ?? "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  return token.length > 0 && token === expected;
}

/**
 * Validate a GHL API key is configured and non-empty.
 */
export function hasGHLConfig(): boolean {
  const key = process.env.GHL_API_KEY;
  const location = process.env.GHL_LOCATION_ID;
  return Boolean(key && key.length > 0 && location && location.length > 0);
}

/**
 * Basic API key validation for Claude / OpenAI keys.
 */
export function hasAIKey(provider: "claude" | "openai"): boolean {
  const key = provider === "claude" ? process.env.CLAUDE_API_KEY : process.env.OPENAI_API_KEY;
  return Boolean(key && key.length > 0);
}