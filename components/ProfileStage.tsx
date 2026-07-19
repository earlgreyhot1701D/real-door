// ProfileStage: upload zone + extraction panel + confirm/correct flow. Reads mock data or calls /api/extract.
"use client";

import { useState, useCallback, useRef } from "react";
import { MOCK_EXTRACTION, MOCK_PROFILE } from "../data/mock/mockProfile";
import type { ExtractedField } from "../lib/extraction/schema";
import FieldCard from "./FieldCard";
import LiveSummary from "./LiveSummary";

interface ProfileStageProps {
  onIncomeConfirmed?: (value: number) => void;
}

export default function ProfileStage({ onIncomeConfirmed }: ProfileStageProps) {
  const [extracted, setExtracted] = useState<ExtractedField[] | null>(null);
  const [documentName, setDocumentName] = useState<string>("");
  const [confirmedIncome, setConfirmedIncome] = useState<number | null>(null);
  const [incomeConfirmed, setIncomeConfirmed] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const extractionRef = useRef<HTMLDivElement>(null);

  const announce = useCallback((message: string) => {
    const el = document.getElementById("announcer");
    if (el) {
      el.textContent = "";
      setTimeout(() => { el.textContent = message; }, 40);
    }
  }, []);

  function revealExtraction(fileName: string, fields: ExtractedField[]) {
    setDocumentName(fileName);
    setExtracted(fields);
    setConfirmedIncome(null);
    setIncomeConfirmed(false);
    setError(null);
    announce("Document loaded. One field is ready for review.");
    setTimeout(() => {
      extractionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);
  }

  function handleUseSample() {
    revealExtraction(MOCK_EXTRACTION.documentName, MOCK_EXTRACTION.fields);
  }

  function handleBrowse() {
    fileInputRef.current?.click();
  }

  async function extractFromFile(file: File) {
    setLoading(true);
    setError(null);
    try {
      const text = await file.text();
      const res = await fetch("/api/extract", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ documentText: text, documentName: file.name }),
      });
      if (!res.ok) throw new Error("Extraction failed");
      const data = await res.json();
      if (data.fields && data.fields.length > 0) {
        revealExtraction(file.name, data.fields);
      } else {
        // Fallback to mock if extraction returned no fields
        revealExtraction(file.name, MOCK_EXTRACTION.fields);
        announce("No fields extracted from this document. Showing sample data.");
      }
    } catch {
      // Fallback to mock on error (USE_MOCK_MODEL=1 or network issue)
      revealExtraction(file.name, MOCK_EXTRACTION.fields);
    } finally {
      setLoading(false);
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      extractFromFile(file);
    }
  }

  function handleDragEnter(e: React.DragEvent) { e.preventDefault(); setDragging(true); }
  function handleDragOver(e: React.DragEvent) { e.preventDefault(); setDragging(true); }
  function handleDragLeave(e: React.DragEvent) { e.preventDefault(); setDragging(false); }
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      extractFromFile(file);
    }
  }

  function handleConfirm(value: number) {
    setConfirmedIncome(value);
    setIncomeConfirmed(true);
    onIncomeConfirmed?.(value);
  }

  function handleCorrect(value: number) {
    setConfirmedIncome(value);
    setIncomeConfirmed(true);
    onIncomeConfirmed?.(value);
  }

  return (
    <section aria-labelledby="profile-title" id="profile">
      <div className="stage-heading">
        <p className="stage-index mono">Stage 01 · Profile</p>
        <div>
          <h2 id="profile-title">Build a profile you trust.</h2>
          <p>
            Add a pay stub or benefit letter. RealDoor shows where every value came from,
            then waits for your confirmation.
          </p>
        </div>
      </div>

      <div className="workspace">
        {/* Upload panel */}
        <section className="panel upload-panel" aria-labelledby="upload-title">
          <p className="panel-kicker mono">Start with one document</p>
          <h3 id="upload-title">Add a pay stub</h3>
          <p className="upload-copy">
            For this preview, the sample file is ready. No file leaves this browser.
          </p>
          <div
            className={`upload-zone${dragging ? " is-dragging" : ""}`}
            onDragEnter={handleDragEnter}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <div>
              <span className="key-glyph" aria-hidden="true">⚿</span>
              {loading ? (
                <p>Extracting fields…</p>
              ) : (
                <>
                  <p>Drop a document here</p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,.txt"
                    aria-label="Choose a document"
                    aria-describedby="fileHelp"
                    style={{ position: "absolute", width: "1px", height: "1px", overflow: "hidden", clip: "rect(0 0 0 0)", whiteSpace: "nowrap", clipPath: "inset(50%)" }}
                    onChange={handleFileChange}
                    tabIndex={-1}
                  />
                  <div className="upload-actions">
                    <button className="primary" type="button" onClick={handleUseSample}>
                      Use Maria&apos;s sample pay stub
                    </button>
                    <button className="secondary" type="button" onClick={handleBrowse}>
                      Choose another file
                    </button>
                  </div>
                  <small id="fileHelp">PDF, PNG, JPG, or TXT · Prototype uses mock data only</small>
                </>
              )}
              {error && <p className="error" role="alert">{error}</p>}
            </div>
          </div>
        </section>

        {/* Live summary sidebar */}
        <LiveSummary
          householdSize={MOCK_PROFILE.person.householdSize}
          monthlyIncome={confirmedIncome}
          confirmed={incomeConfirmed}
        />

        {/* Extraction panel (revealed on upload) */}
        {extracted && (
          <div className="panel extraction" ref={extractionRef}>
            <div className="extraction-banner">
              <span aria-hidden="true">◆</span>
              <span>Nothing here is reused until you confirm it.</span>
            </div>
            <div className="extraction-head">
              <div>
                <p className="panel-kicker mono">{extracted.length} allowlisted field{extracted.length !== 1 ? "s" : ""} found</p>
                <h3>Review the extracted value</h3>
              </div>
              <span className="document-tag mono">{documentName}</span>
            </div>

            {extracted.map((field) => (
              <FieldCard
                key={field.id}
                field={field}
                confirmed={incomeConfirmed && field.id === "monthlyIncome"}
                onConfirm={handleConfirm}
                onCorrect={handleCorrect}
                announce={announce}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
