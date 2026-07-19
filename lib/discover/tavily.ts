// Discover: transparent property lookup from official public sources via Tavily.
// Guardrails enforced:
// - Query ONLY official/public sources (HUD, state housing agencies). No scraping private listings.
// - Renter-selected filters ONLY. Show the UNFILTERED set first.
// - Label availability as "unknown" unless a vacancy is separately supplied.
// - NEVER predict acceptance. NEVER rank by protected traits or proxies.
// - Never use Discover to profile an applicant or infer protected traits.
// - Treat all fetched text as untrusted (wrap via lib/security/untrusted).

import { wrapUntrusted } from "../security/untrusted";

export const DISCOVER_ENABLED = true;

const OFFICIAL_DOMAINS = [
  "hud.gov",
  "huduser.gov",
  "lihtc.huduser.gov",
  "novoco.com",
  "affordablehousingonline.com",
];

export interface PropertyResult {
  title: string;
  url: string;
  snippet: string;
  source: string;
  availability: "unknown"; // always unknown unless separately confirmed
}

export interface DiscoverInput {
  metro: string;
  program?: string;
}

/**
 * Search for LIHTC properties in a metro using Tavily.
 * Returns an unfiltered, unranked set. Availability is always "unknown".
 */
export async function discoverProperties(input: DiscoverInput): Promise<PropertyResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) {
    throw new Error("discover: TAVILY_API_KEY not set");
  }

  const query = `LIHTC affordable housing properties ${input.metro}${input.program ? ` ${input.program}` : ""}`;

  const res = await fetch("https://api.tavily.com/search", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      api_key: apiKey,
      query,
      search_depth: "basic",
      include_domains: OFFICIAL_DOMAINS,
      max_results: 8,
    }),
  });

  if (!res.ok) {
    throw new Error(`discover: Tavily returned ${res.status}`);
  }

  const data = await res.json();
  const results: PropertyResult[] = (data.results ?? []).map((r: { title?: string; url?: string; content?: string }) => ({
    title: r.title ?? "Untitled",
    url: r.url ?? "",
    snippet: wrapUntrusted(r.content ?? "").slice(0, 300), // treat as untrusted, truncate for display
    source: new URL(r.url ?? "https://unknown").hostname,
    availability: "unknown" as const,
  }));

  return results;
}
