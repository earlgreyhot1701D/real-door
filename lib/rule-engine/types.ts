// Types for the deterministic rule engine. No model, no I/O. Pure data shapes.

export interface ProgramLimits {
  program: string;
  ruleYear: number;
  effectiveDate: string; // ISO date of the limit table
  householdSize: number;
  annualLimit: number; // applicable income limit for the household size
}

export interface EngineInput {
  monthlyIncomeConfirmed: number; // renter-confirmed, never model-assigned
  householdSize: number;
  limits: ProgramLimits;
}

// Neutral output. NEVER contains eligible/ineligible/score/rank.
export interface EngineOutput {
  annualizedIncome: number; // monthly * 12
  applicableLimit: number;
  differenceToLimit: number; // limit - annualized (may be negative). Neutral figure only.
  formula: string; // human-readable, e.g. "monthly gross x 12"
  effectiveDate: string;
  source: string;
}
