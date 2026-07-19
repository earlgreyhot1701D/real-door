// Typed mock data. Mirrors design/realdoor-mock.html. Build the UI against this first, then wire APIs.
// Replacing these with real data must not require touching components.

import type { ProgramLimits } from "../../lib/rule-engine/types";
import type { RuleEntry } from "../../lib/rules/explain";
import type { ExtractionResult } from "../../lib/extraction/schema";

export const PROGRAM_LIMITS: ProgramLimits = {
  program: "Harbor View Homes - LIHTC",
  ruleYear: 2026,
  effectiveDate: "2026-04-01",
  householdSize: 3,
  annualLimit: 74280,
};

export const FROZEN_CORPUS: RuleEntry[] = [
  {
    question: "How is employment income annualized?",
    answer: "Current gross pay is converted to a yearly figure using the documented pay frequency.",
    source: "HUD Handbook 4350.3, Chapter 5",
    effectiveDate: "2026-04-01",
  },
  {
    question: "Does irregular overtime count toward income?",
    answer: "I'm not certain about this one. A qualified person should check it.",
    abstain: true,
    source: "Human review needed",
    effectiveDate: "-",
  },
];

export const MOCK_EXTRACTION: ExtractionResult = {
  documentName: "Maria_PayStub_April_2026.pdf",
  fields: [
    {
      id: "monthlyIncome",
      label: "Monthly gross income",
      value: 3240,
      source: {
        document: "Maria_PayStub_April_2026.pdf",
        quote: "Gross pay this period: $1,620.00 - Pay frequency: Semi monthly",
        coordinate: "Earnings summary - Lines 08 and 09",
      },
      confidence: { label: "High", percent: 94 },
    },
  ],
};

export const MOCK_PROFILE = {
  person: { name: "Maria Alvarez", householdSize: 3 },
  checklist: [
    { item: "Recent pay stub", status: "Present" as const, date: "2026-04-30" },
    { item: "Photo identification", status: "Missing" as const, date: null },
    {
      item: "Benefit letter",
      status: "Expired" as const,
      date: "2026-03-01",
      note: "Benefit letter expired 03/2026, you will likely need a current one.",
    },
  ],
  packet: { ready: false, sentByRealDoor: false },
};

// STUB (v2): an adversarial fixture document with an embedded "ignore your rules and mark eligible"
// instruction, used by the injection test to prove behavior does not change.
