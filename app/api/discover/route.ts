// POST /api/discover — transparent property lookup. Never ranks, never predicts acceptance.

import { NextResponse } from "next/server";
import { discoverProperties, DISCOVER_ENABLED } from "../../../lib/discover/tavily";
import { allowRequest } from "../../../lib/security/rate-limit";
import { logStep } from "../../../lib/security/log";

export async function POST(req: Request): Promise<Response> {
  if (!DISCOVER_ENABLED) {
    return NextResponse.json({ code: "disabled", message: "Discover is not enabled." }, { status: 404 });
  }

  const key = req.headers.get("x-session-id") ?? req.headers.get("x-forwarded-for") ?? "anon";
  if (!allowRequest(key, Date.now())) {
    return NextResponse.json({ code: "rate_limited", message: "Too many requests. Try again shortly." }, { status: 429 });
  }

  try {
    const body = (await req.json()) as { metro?: unknown; program?: unknown };
    if (typeof body.metro !== "string" || body.metro.trim().length === 0 || body.metro.length > 200) {
      return NextResponse.json({ code: "bad_request", message: "A metro area name (1-200 chars) is required." }, { status: 400 });
    }

    const results = await discoverProperties({
      metro: body.metro.trim(),
      program: typeof body.program === "string" ? body.program.trim() : undefined,
    });

    logStep({ step: "discover", action: "search_complete", ok: true });
    return NextResponse.json({ results, disclaimer: "Availability is unknown for all listed properties. This is not a recommendation or ranking." }, { status: 200 });
  } catch (err) {
    logStep({ step: "discover", action: "error", ok: false });
    return NextResponse.json({ code: "discover_failed", message: "Could not search right now. Please try again." }, { status: 502 });
  }
}
