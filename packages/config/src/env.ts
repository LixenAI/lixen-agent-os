/**
 * Type-safe environment variable loader.
 * All env access should go through here so credentials never leak to the client.
 */

export function loadEnv(key: string, fallback?: string): string {
  const value = process.env[key];
  if (value === undefined) {
    if (fallback !== undefined) return fallback;
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

export function requireEnv(key: string): string {
  return loadEnv(key);
}