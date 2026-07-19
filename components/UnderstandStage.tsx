// UnderstandStage: rules explanation + deterministic calculation. No model assigns numbers here.
"use client";

import { useCallback } from "react";
import RulesAnswer from "./RulesAnswer";
import CalcPanel from "./CalcPanel";
import type { RulesResponse } from "../lib/rules/explain";

interface UnderstandStageProps {
  monthlyIncome: number | null;
  householdSize: number;
  confirmed: boolean;
  announce: (message: string) => void;
}

export default function UnderstandStage({ monthlyIncome, householdSize, confirmed, announce }: UnderstandStageProps) {
  const askRule = useCallback(async (question: string): Promise<RulesResponse> => {
    const res = await fetch("/api/rules", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question }),
    });
    if (!res.ok) throw new Error("Rules request failed");
    return res.json();
  }, []);

  return (
    <section aria-labelledby="understand-title" id="understand">
      <div className="stage-heading">
        <p className="stage-index mono">Stage 02 · Understand</p>
        <div>
          <h2 id="understand-title">Understand the rules behind the numbers.</h2>
          <p>
            Ask about this program&apos;s requirements. Every answer is cited with a source and effective date,
            or the system abstains and directs you to a qualified person.
          </p>
        </div>
      </div>

      <div className="understand-workspace">
        <div className="panel understand-panel">
          <RulesAnswer onAsk={askRule} announce={announce} />
        </div>
        <div className="panel understand-panel">
          <CalcPanel
            monthlyIncome={monthlyIncome}
            householdSize={householdSize}
            confirmed={confirmed}
            announce={announce}
          />
        </div>
      </div>
    </section>
  );
}
