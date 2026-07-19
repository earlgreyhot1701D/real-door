// POST /api/calculate — deterministic math only. Calls the pure rule engine. No model here.

import { NextResponse } from "next/server";
import { evaluate } from "../../../lib/rule-engine";
import type { ProgramLimits } from "../../../lib/rule-engine/types";
import { isFiniteNumberInRange, parseMoney } from "../../../lib/security/sanitize";
import { PROGRAM_LIMITS } from "../../../data/mock/mockProfile";

export async function POST(req: Request): Promise<Response> {
  try {
    const body = (await req.json()) as { monthlyIncome?: unknown; householdSize?: unknown };
    const monthly = parseMoney(body.monthlyIncome);
    const householdSize = body.householdSize;

    if (monthly === null || monthly <= 0) {
      return NextResponse.json({ code: "bad_request", message: "A confirmed monthly income greater than zero is required." }, { status: 400 });
    }
    if (!isFiniteNumberInRange(householdSize, 1, 12)) {
      return NextResponse.json({ code: "bad_request", message: "A valid household size is required." }, { status: 400 });
    }

    const limits = PROGRAM_LIMITS as ProgramLimits;
    const result = evaluate({ monthlyIncomeConfirmed: monthly, householdSize, limits });
    return NextResponse.json(result, { status: 200 });
  } catch (err) {
    return NextResponse.json({ code: "calc_failed", message: (err as Error).message }, { status: 400 });
  }
}
