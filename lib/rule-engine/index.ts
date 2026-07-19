// Deterministic rule engine. PURE functions only. The model NEVER runs here.
// Invariant: must reproduce data/fixtures/rule-engine.fixtures.json EXACTLY.
// NEVER return a verdict (eligible/ineligible/score/rank). Neutral numbers only.

import type { EngineInput, EngineOutput } from "./types";

const MONTHS_PER_YEAR = 12;

/**
 * Annualize confirmed monthly income and compare to the applicable program limit.
 * Returns neutral figures the renter and a qualified human can read. No decision.
 */
export function evaluate(input: EngineInput): EngineOutput {
  if (!Number.isFinite(input.monthlyIncomeConfirmed) || input.monthlyIncomeConfirmed < 0) {
    throw new Error("rule-engine: monthlyIncomeConfirmed must be a finite, non-negative number");
  }
  if (input.householdSize !== input.limits.householdSize) {
    // MUST use the limit row matching the household size. Do not guess a row.
    throw new Error("rule-engine: household size does not match the provided limit row");
  }

  const annualizedIncome = round2(input.monthlyIncomeConfirmed * MONTHS_PER_YEAR);
  const applicableLimit = input.limits.annualLimit;

  return {
    annualizedIncome,
    applicableLimit,
    differenceToLimit: round2(applicableLimit - annualizedIncome),
    formula: "monthly gross income x 12",
    effectiveDate: input.limits.effectiveDate,
    source: `${input.limits.program} income limits (${input.limits.ruleYear})`,
  };
}

function round2(n: number): number {
  return Math.round((n + Number.EPSILON) * 100) / 100;
}

// STUB (v2): utility-allowance and asset-inclusion adjustments.
// Implementation note: add pure helpers here, each with its own fixtures. Keep the model out.
