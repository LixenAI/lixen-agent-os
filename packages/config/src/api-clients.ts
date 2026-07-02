/**
 * Stub API clients for GHL, Claude, and OpenAI.
 * Replace with real SDK implementations as integrations mature.
 */

export class GHLClient {
  private apiKey: string;
  private locationId: string;

  constructor() {
    this.apiKey = process.env.GHL_API_KEY || "";
    this.locationId = process.env.GHL_LOCATION_ID || "";
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0 && this.locationId.length > 0;
  }

  async request(endpoint: string, options?: RequestInit): Promise<unknown> {
    if (!this.isConfigured()) throw new Error("GHL not configured");
    const url = `https://rest.gohighlevel.com/v1/${endpoint}`;
    const res = await fetch(url, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.apiKey}`,
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });
    return res.json();
  }
}

export class ClaudeClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.CLAUDE_API_KEY || "";
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }
}

export class OpenAIClient {
  private apiKey: string;

  constructor() {
    this.apiKey = process.env.OPENAI_API_KEY || "";
  }

  isConfigured(): boolean {
    return this.apiKey.length > 0;
  }
}