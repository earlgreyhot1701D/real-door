// DiscoverStage: transparent property lookup (stretch goal). Never ranks, never predicts acceptance.
"use client";

import { useState, useCallback } from "react";
import type { PropertyResult } from "../lib/discover/tavily";

interface DiscoverStageProps {
  announce: (message: string) => void;
}

export default function DiscoverStage({ announce }: DiscoverStageProps) {
  const [metro, setMetro] = useState("Cambridge, MA");
  const [results, setResults] = useState<PropertyResult[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    const q = metro.trim();
    if (!q) {
      setError("Enter a metro area to search.");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/discover", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ metro: q }),
      });
      if (!res.ok) throw new Error("Search failed");
      const data = await res.json();
      setResults(data.results);
      announce(`Found ${data.results.length} properties. Availability is unknown for all.`);
    } catch {
      setError("Could not search right now. Please try again.");
      announce("Property search failed.");
    } finally {
      setLoading(false);
    }
  }, [metro, announce]);

  return (
    <section aria-labelledby="discover-title" id="discover">
      <div className="stage-heading">
        <p className="stage-index mono">Stretch · Discover</p>
        <div>
          <h2 id="discover-title">Find LIHTC properties near you.</h2>
          <p>
            Search public records for affordable housing properties in your area.
            Availability is always labeled unknown — this is not a vacancy list or a recommendation.
          </p>
        </div>
      </div>

      <div className="panel discover-panel">
        <form onSubmit={handleSearch} className="discover-form">
          <label htmlFor="discover-metro" className="field-label mono">
            Metro area
          </label>
          <div className="rules-input-row">
            <input
              id="discover-metro"
              type="text"
              className="field-input rules-input"
              placeholder="e.g. Cambridge, MA"
              value={metro}
              onChange={(e) => { setMetro(e.target.value); setError(null); }}
              aria-describedby="discover-error"
              maxLength={200}
            />
            <button type="submit" className="secondary" disabled={loading}>
              {loading ? "Searching…" : "Search"}
            </button>
          </div>
          {error && <p className="error" id="discover-error" role="alert">{error}</p>}
        </form>

        {results && (
          <div className="discover-results" aria-live="polite">
            <p className="discover-disclaimer mono">
              Availability: Unknown for all · Not a recommendation · Unfiltered public records
            </p>
            {results.length === 0 ? (
              <p className="calc-placeholder">No properties found for this area in official sources.</p>
            ) : (
              <ul className="discover-list" role="list">
                {results.map((r, i) => (
                  <li key={i} className="discover-item">
                    <div className="discover-item-header">
                      <strong className="discover-item-title">{r.title}</strong>
                      <span className="discover-availability mono">Availability: Unknown</span>
                    </div>
                    <p className="discover-item-source mono">Source: {r.source}</p>
                    {r.url && (
                      <a
                        href={r.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-control"
                      >
                        View on source site
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
