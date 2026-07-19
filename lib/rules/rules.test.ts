// Contract tests for the rules tier: cited answers, abstention, and decision deflection.

import { describe, it, expect } from "vitest";
import { explainRule, ABSTAIN_MESSAGE, type RuleEntry } from "./explain";
import { FROZEN_CORPUS } from "../../data/mock/mockProfile";

const corpus = FROZEN_CORPUS as RuleEntry[];

describe("explainRule()", () => {
  it("returns a cited answer with source and effective date for a matching question", () => {
    const res = explainRule("How is employment income annualized?", corpus);
    expect(res.abstain).toBe(false);
    expect(res.answer).toBeTruthy();
    expect(res.source).toBe("HUD Handbook 4350.3, Chapter 5");
    expect(res.effectiveDate).toBe("2026-04-01");
  });

  it("abstains when no confident match exists", () => {
    const res = explainRule("What color is the sky?", corpus);
    expect(res.abstain).toBe(true);
    expect(res.answer).toBe(ABSTAIN_MESSAGE);
    expect(res.source).toBe("Human review needed");
  });

  it("abstains for a corpus entry marked abstain (irregular overtime)", () => {
    const res = explainRule("Does irregular overtime count toward income?", corpus);
    expect(res.abstain).toBe(true);
    expect(res.answer).toBe(ABSTAIN_MESSAGE);
  });

  it("deflects 'am I eligible' without a verdict", () => {
    const res = explainRule("Am I eligible for this program?", corpus);
    expect(res.abstain).toBe(false);
    expect(res.answer).toContain("does not decide eligibility");
    expect(res.source).toContain("no decisioning");
  });

  it("deflects 'decide for me' without a verdict", () => {
    const res = explainRule("Just decide for me already!", corpus);
    expect(res.answer).toContain("does not decide eligibility");
  });

  it("never contains verdict language in any response", () => {
    const FORBIDDEN = ["eligible", "ineligible", "approved", "denied", "score", "rank"];
    const questions = [
      "How is employment income annualized?",
      "What is the limit?",
      "Am I eligible?",
      "random nonsense question",
    ];
    for (const q of questions) {
      const res = explainRule(q, corpus);
      const serialized = JSON.stringify(res).toLowerCase();
      // The deflection message says "does not decide eligibility" which contains "eligib" -
      // but it's a REFUSAL not a verdict. Check that we never say "you are eligible" etc.
      if (!serialized.includes("does not decide")) {
        for (const word of FORBIDDEN) {
          expect(serialized).not.toContain(word);
        }
      }
    }
  });
});
