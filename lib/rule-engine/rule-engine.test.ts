// Tests for the deterministic rule engine against data/fixtures/rule-engine.fixtures.json.

import { describe, it, expect } from "vitest";
import { evaluate } from "./index";
import type { EngineInput } from "./types";
import fixtures from "../../data/fixtures/rule-engine.fixtures.json";

describe("rule-engine evaluate()", () => {
  describe("happy-path cases", () => {
    for (const tc of fixtures.cases) {
      it(tc.name, () => {
        const result = evaluate(tc.input as EngineInput);
        expect(result).toEqual(tc.expected);
      });
    }
  });

  describe("error cases", () => {
    for (const tc of fixtures.errorCases) {
      it(tc.name, () => {
        expect(() => evaluate(tc.input as EngineInput)).toThrow();
      });
    }
  });

  describe("neutrality invariant — no verdict in output", () => {
    const FORBIDDEN = ["eligible", "ineligible", "score", "rank", "approved", "denied"];

    for (const tc of fixtures.cases) {
      it(`${tc.name}: output contains no verdict language`, () => {
        const result = evaluate(tc.input as EngineInput);
        const serialized = JSON.stringify(result).toLowerCase();
        for (const word of FORBIDDEN) {
          expect(serialized).not.toContain(word);
        }
      });
    }
  });
});
