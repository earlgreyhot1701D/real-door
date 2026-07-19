// POST /api/rules — cited rules answer or ABSTAIN. Deflects decision requests. Never a verdict.

import { NextResponse } from "next/server";
import { explainRule, type RuleEntry } from "../../../lib/rules/explain";
import { validateQuestion } from "../../../lib/security/sanitize";
import { allowRequest } from "../../../lib/security/rate-limit";
import { FROZEN_CORPUS } from "../../../data/mock/mockProfile";

export async function POST(req: Request): Promise<Response> {
  const key = req.headers.get("x-session-id") ?? req.headers.get("x-forwarded-for") ?? "anon";
  if (!allowRequest(key, Date.now())) {
    return NextResponse.json({ code: "rate_limited", message: "Too many requests. Try again shortly." }, { status: 429 });
  }

  try {
    const body = (await req.json()) as { question?: unknown };
    const question = validateQuestion(body.question);
    if (!question) {
      return NextResponse.json({ code: "bad_request", message: "A question (1-500 chars) is required." }, { status: 400 });
    }
    const answer = explainRule(question, FROZEN_CORPUS as RuleEntry[]);
    return NextResponse.json(answer, { status: 200 });
  } catch {
    return NextResponse.json({ code: "rules_failed", message: "Could not answer that right now." }, { status: 502 });
  }
}
