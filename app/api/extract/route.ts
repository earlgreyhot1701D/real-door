// POST /api/extract — server-side extraction. Validates input, rate-limits, wraps untrusted text.
// Returns allowlisted, source-bearing fields only. Never returns raw document contents.

import { NextResponse } from "next/server";
import { extractFields } from "../../../lib/extraction/extract";
import { allowRequest } from "../../../lib/security/rate-limit";
import { logStep } from "../../../lib/security/log";

export async function POST(req: Request): Promise<Response> {
  const key = req.headers.get("x-session-id") ?? req.headers.get("x-forwarded-for") ?? "anon";
  if (!allowRequest(key, Date.now())) {
    return NextResponse.json({ code: "rate_limited", message: "Too many requests. Try again shortly." }, { status: 429 });
  }

  try {
    const body = (await req.json()) as { documentText?: unknown; documentName?: unknown };
    if (typeof body.documentText !== "string" || typeof body.documentName !== "string") {
      return NextResponse.json({ code: "bad_request", message: "documentText and documentName are required." }, { status: 400 });
    }
    const result = await extractFields(body.documentText, body.documentName);
    logStep({ step: "extract", action: "fields_extracted", ok: true });
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    logStep({ step: "extract", action: "error", ok: false });
    // Never leak provider errors or stack traces to the client.
    return NextResponse.json({ code: "extract_failed", message: "Could not read the document. Please try again." }, { status: 502 });
  }
}
