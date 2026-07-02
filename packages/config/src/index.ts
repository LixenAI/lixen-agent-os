/**
 * Shared configuration, environment loading, and API clients for LixenAI.
 */

// ── Environment Loader ──
export { loadEnv, requireEnv } from "./env";

// ── Constants ──
export { APP_NAME, APP_VERSION, DEFAULT_TIMEOUT } from "./constants";

// ── API Clients (stubbed — implement with real SDKs as needed) ──
export { GHLClient, ClaudeClient, OpenAIClient } from "./api-clients";