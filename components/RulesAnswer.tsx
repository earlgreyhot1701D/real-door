// RulesAnswer: cited answer with source + effective date, or ABSTAIN state with human-review message.
"use client";

import { useState } from "react";
import type { RulesResponse } from "../lib/rules/explain";

interface RulesAnswerProps {
  onAsk: (question: string) => Promise<RulesResponse>;
  announce: (message: string) => void;
}

export default function RulesAnswer({ onAsk, announce }: RulesAnswerProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<RulesResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const q = question.trim();
    if (!q || q.length > 500) {
      setError("Please enter a question (1–500 characters).");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await onAsk(q);
      setAnswer(res);
      if (res.abstain) {
        announce("The system is not certain. A qualified person should check this.");
      } else {
        announce("Rules answer received with citation.");
      }
    } catch {
      setError("Could not get an answer right now. Please try again.");
      announce("Rules question failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rules-answer-panel">
      <form onSubmit={handleSubmit} className="rules-form">
        <label htmlFor="rules-question" className="field-label mono">
          Ask about this program&apos;s rules
        </label>
        <div className="rules-input-row">
          <input
            id="rules-question"
            type="text"
            className="field-input rules-input"
            placeholder="e.g. How is employment income annualized?"
            value={question}
            onChange={(e) => { setQuestion(e.target.value); setError(null); }}
            aria-describedby="rules-error"
            aria-invalid={error ? "true" : undefined}
            maxLength={500}
          />
          <button type="submit" className="secondary" disabled={loading}>
            {loading ? "Asking…" : "Ask"}
          </button>
        </div>
        {error && (
          <p className="error" id="rules-error" role="alert">{error}</p>
        )}
      </form>

      {answer && (
        <div className="rules-result" aria-live="polite">
          {answer.abstain ? (
            <div className="rules-abstain">
              <p className="rules-abstain-icon" aria-hidden="true">⚠</p>
              <p className="rules-abstain-text">{answer.answer}</p>
              <p className="rules-meta mono">Source: {answer.source}</p>
            </div>
          ) : (
            <div className="rules-cited">
              <p className="rules-answer-text">{answer.answer}</p>
              <div className="rules-citation">
                <span className="mono">Source</span>
                <span>{answer.source}</span>
              </div>
              <div className="rules-citation">
                <span className="mono">Effective date</span>
                <span>{answer.effectiveDate}</span>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
