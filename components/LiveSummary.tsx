// LiveSummary: sticky sidebar showing household info and annualized income. Updates on confirm/correct.
"use client";

interface LiveSummaryProps {
  householdSize: number;
  monthlyIncome: number | null; // null = not yet confirmed
  confirmed: boolean;
}

const money = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
});

export default function LiveSummary({ householdSize, monthlyIncome, confirmed }: LiveSummaryProps) {
  const annualized = monthlyIncome !== null ? monthlyIncome * 12 : null;

  return (
    <aside className="panel summary" aria-labelledby="summary-title">
      <div className="summary-head">
        <p className="mono">Live profile summary</p>
        <h3 id="summary-title">Maria&apos;s household</h3>
      </div>
      <div className="summary-body">
        <div className="summary-row">
          <span>Household size</span>
          <strong>{householdSize} people</strong>
        </div>
        <div className="summary-row">
          <span>Monthly income</span>
          <strong>{confirmed && monthlyIncome !== null ? money.format(monthlyIncome) : "Not confirmed"}</strong>
        </div>
        <div className="annual">
          <span className="mono">Annualized figure</span>
          <output aria-live="polite">
            {confirmed && annualized !== null ? money.format(annualized) : "Waiting for confirmation"}
          </output>
          <small>Monthly income × 12</small>
        </div>
        <p className="summary-note">This summary updates when you correct and confirm a field.</p>
      </div>
    </aside>
  );
}
