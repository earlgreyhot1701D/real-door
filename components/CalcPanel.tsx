// CalcPanel: deterministic math display. Calls /api/calculate. Shows "computed by the rule engine, not the AI."
"use client";

import { useState, useEffect } from "react";
import type { EngineOutput } from "../lib/rule-engine/types";

interface CalcPanelProps {
  monthlyIncome: number | null; // null = not yet confirmed
  householdSize: number;
  confirmed: boolean;
  announce: (message: string) => void;
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function CalcPanel({ monthlyIncome, householdSize, confirmed, announce }: CalcPanelProps) {
  const [result, setResult] = useState<EngineOutput | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!confirmed || monthlyIncome === null) {
      setResult(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetch("/api/calculate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ monthlyIncome, householdSize }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Calculation failed");
        return res.json();
      })
      .then((data: EngineOutput) => {
        if (!cancelled) {
          setResult(data);
          setLoading(false);
          announce("Calculation updated.");
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError("Could not compute. Please try again.");
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [monthlyIncome, householdSize, confirmed, announce]);

  if (!confirmed) {
    return (
      <div className="calc-panel calc-waiting">
        <p className="mono panel-kicker">Income calculation</p>
        <p className="calc-placeholder">Confirm your monthly income to see the calculation.</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="calc-panel">
        <p className="mono panel-kicker">Income calculation</p>
        <p className="calc-placeholder">Computing…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="calc-panel">
        <p className="mono panel-kicker">Income calculation</p>
        <p className="error" role="alert">{error}</p>
      </div>
    );
  }

  if (!result) return null;

  const difference = result.differenceToLimit;
  const diffLabel = difference >= 0 ? "below" : "above";

  return (
    <div className="calc-panel" aria-live="polite">
      <p className="mono panel-kicker">Income calculation</p>
      <h3 className="calc-title">Deterministic income math</h3>

      <div className="calc-grid">
        <div className="calc-row">
          <span>Formula</span>
          <strong>{result.formula}</strong>
        </div>
        <div className="calc-row">
          <span>Annualized income</span>
          <strong>{money.format(result.annualizedIncome)}</strong>
        </div>
        <div className="calc-row">
          <span>Program limit (household of {householdSize})</span>
          <strong>{money.format(result.applicableLimit)}</strong>
        </div>
        <div className="calc-row calc-difference">
          <span>Difference</span>
          <strong>
            {money.format(Math.abs(difference))} {diffLabel} the limit
          </strong>
        </div>
      </div>

      <div className="calc-meta">
        <div className="rules-citation">
          <span className="mono">Source</span>
          <span>{result.source}</span>
        </div>
        <div className="rules-citation">
          <span className="mono">Effective date</span>
          <span>{result.effectiveDate}</span>
        </div>
      </div>

      <p className="calc-disclaimer">
        Computed by the rule engine, not the AI.
      </p>
    </div>
  );
}
