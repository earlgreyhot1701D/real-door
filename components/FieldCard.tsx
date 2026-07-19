// FieldCard: value + source box + confidence + confirm/correct for one extracted field.
"use client";

import { useState, useRef } from "react";
import type { ExtractedField } from "../lib/extraction/schema";

interface FieldCardProps {
  field: ExtractedField;
  onConfirm: (confirmedValue: number) => void;
  onCorrect: (correctedValue: number) => void;
  confirmed: boolean;
  announce: (message: string) => void;
}

export default function FieldCard({ field, onConfirm, onCorrect, confirmed, announce }: FieldCardProps) {
  const [inputValue, setInputValue] = useState(formatMoney(field.value as number));
  const [error, setError] = useState<string | null>(null);
  const [edited, setEdited] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  function handleInput(e: React.ChangeEvent<HTMLInputElement>) {
    setInputValue(e.target.value);
    setError(null);
    setEdited(true);
  }

  function handleConfirm() {
    const parsed = parseAmount(inputValue);
    if (!Number.isFinite(parsed) || parsed <= 0) {
      setError("Please enter a monthly amount greater than zero.");
      inputRef.current?.focus();
      announce("Please correct the monthly income amount.");
      return;
    }
    setInputValue(formatMoney(parsed));
    setError(null);
    setEdited(false);
    if (edited) {
      onCorrect(parsed);
    } else {
      onConfirm(parsed);
    }
    announce("Field confirmed. Annualized figure updated.");
  }

  function handleCorrectClick() {
    inputRef.current?.focus();
    inputRef.current?.select();
    announce("Monthly income field ready to correct.");
  }

  const stateLabel = confirmed
    ? "Confirmed by you"
    : edited
      ? "Edited · confirmation needed"
      : "Waiting for your confirmation";
  const stateIcon = confirmed ? "✓" : "○";

  return (
    <article className="field-card" aria-labelledby={`${field.id}-label`}>
      <div className="field-top">
        <div>
          <label className="field-label mono" id={`${field.id}-label`} htmlFor={field.id}>
            {field.label}
          </label>
          <div className="field-input-wrap">
            <span className="currency" aria-hidden="true">$</span>
            <input
              ref={inputRef}
              className="field-input"
              id={field.id}
              name={field.id}
              type="text"
              inputMode="decimal"
              autoComplete="off"
              aria-describedby={`${field.id}-error ${field.id}-source ${field.id}-confidence`}
              aria-invalid={error ? "true" : undefined}
              value={inputValue}
              onChange={handleInput}
            />
          </div>
          {error && (
            <p className="error" id={`${field.id}-error`} role="alert">
              {error}
            </p>
          )}
        </div>
        <p className={`field-state${confirmed ? " is-confirmed" : ""}`}>
          <span className="field-state-icon" aria-hidden="true">{stateIcon}</span>
          <span>{stateLabel}</span>
        </p>
      </div>

      <div className="evidence-grid">
        <div className="source-box" id={`${field.id}-source`}>
          <span className="mono">Source · Quoted exactly</span>
          <q>{field.source.quote}</q>
          <span className="source-coordinate mono">
            {field.source.document} · {field.source.coordinate}
          </span>
        </div>
        <div className="confidence" id={`${field.id}-confidence`}>
          <span className="mono">Extraction confidence</span>
          <div className="confidence-line">
            <span>Confidence</span>
            <strong>{field.confidence.label} · {field.confidence.percent}%</strong>
          </div>
          <div className="confidence-track" role="img" aria-label={`${field.confidence.label} confidence, ${field.confidence.percent} percent`}>
            <span className="confidence-fill" style={{ width: `${field.confidence.percent}%` }} />
          </div>
          <small>Confidence describes the extraction, not the person or their circumstances.</small>
        </div>
      </div>

      <div className="field-actions">
        <button className="text-control" type="button" onClick={handleCorrectClick}>
          Correct this field
        </button>
        <button className="secondary" type="button" onClick={handleConfirm}>
          Confirm this value
        </button>
      </div>
    </article>
  );
}

function formatMoney(n: number): string {
  return n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function parseAmount(value: string): number {
  return Number(value.replace(/[^0-9.]/g, ""));
}
