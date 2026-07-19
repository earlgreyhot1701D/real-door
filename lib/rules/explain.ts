// Rules tier. Answer ONLY from the frozen corpus for one program + rule year.
// Every answer carries a source and effective date, or it ABSTAINS. Never an eligibility statement.

export interface RuleEntry {
  question: string;
  answer: string;
  source: string;
  effectiveDate: string;
  abstain?: boolean;
}

export interface RulesResponse {
  answer: string;
  source: string;
  effectiveDate: string;
  abstain: boolean;
}

const ABSTAIN_MESSAGE = "I'm not certain about this one. A qualified person should check it.";

// Phrases that imply a decision request. Deflect, never answer with a verdict.
const DECISION_TRIGGERS = ["am i eligible", "will i get in", "do i qualify", "decide for me", "approve me"];

/**
 * Answer a rules question from the frozen corpus.
 * Deflects decision requests. Abstains when there is no confident match.
 */
export function explainRule(question: string, corpus: RuleEntry[]): RulesResponse {
  const q = question.trim().toLowerCase();

  if (DECISION_TRIGGERS.some((t) => q.includes(t))) {
    return {
      answer:
        "RealDoor does not decide eligibility. Here is what to check instead: the program rule, the value you confirmed, and the calculation. A qualified person makes the decision.",
      source: "RealDoor policy - no decisioning",
      effectiveDate: "-",
      abstain: false,
    };
  }

  const match = corpus.find((r) => overlaps(q, r.question.toLowerCase()));
  if (!match || match.abstain) {
    return { answer: ABSTAIN_MESSAGE, source: "Human review needed", effectiveDate: "-", abstain: true };
  }

  return { answer: match.answer, source: match.source, effectiveDate: match.effectiveDate, abstain: false };
}

// Naive keyword overlap for the prototype corpus lookup.
// STUB (v2): replace with an embedding match over the frozen corpus, still abstaining below a confidence floor.
function overlaps(a: string, b: string): boolean {
  const aw = new Set(a.split(/\W+/).filter((w) => w.length > 3));
  const bw = b.split(/\W+/).filter((w) => w.length > 3);
  const hits = bw.filter((w) => aw.has(w)).length;
  return hits >= 2;
}

export { ABSTAIN_MESSAGE };
