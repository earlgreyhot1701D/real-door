// Single page: Profile -> Understand -> Prepare -> Packet. All stages wired.
"use client";

import { useState, useCallback } from "react";
import ProfileStage from "../components/ProfileStage";
import UnderstandStage from "../components/UnderstandStage";
import PrepareStage from "../components/PrepareStage";
import DiscoverStage from "../components/DiscoverStage";

export default function Home() {
  const [currentStep, setCurrentStep] = useState<string>("profile");
  const [confirmedIncome, setConfirmedIncome] = useState<number | null>(null);
  const [incomeConfirmed, setIncomeConfirmed] = useState(false);
  const householdSize = 3; // from mock profile

  const announce = useCallback((message: string) => {
    const el = document.getElementById("announcer");
    if (el) {
      el.textContent = "";
      setTimeout(() => { el.textContent = message; }, 40);
    }
  }, []);

  function handleDeleteSession() {
    // Reload clears all in-memory state (stateless, no DB)
    announce("Session deleted. All data cleared.");
    setTimeout(() => { window.location.reload(); }, 100);
  }

  function handleIncomeConfirmed(value: number) {
    setConfirmedIncome(value);
    setIncomeConfirmed(true);
  }

  function handleStepClick(step: string) {
    const navigable = ["profile", "understand", "prepare"];
    if (navigable.includes(step)) {
      setCurrentStep(step);
      document.getElementById(step)?.scrollIntoView({ behavior: "smooth" });
      announce(`${step.charAt(0).toUpperCase() + step.slice(1)} is the current stage.`);
    } else {
      announce(`${step.charAt(0).toUpperCase() + step.slice(1)} will be available in a later step.`);
    }
  }

  return (
    <>
      <header className="site-header">
        <div className="shell nav">
          <a className="brand" href="#top" aria-label="RealDoor home">
            <span className="door-mark" aria-hidden="true" />
            <span className="brand-copy">
              <span className="brand-name">RealDoor</span>
              <span className="promise">A clearer path through housing paperwork.</span>
            </span>
          </a>
          <button className="delete-session" type="button" onClick={handleDeleteSession}>
            Delete my session
          </button>
        </div>
        <div className="status-strip mono">
          Demo mode · No real data is processed · Nothing is sent for you · You confirm every field
        </div>
      </header>

      <nav className="progress-wrap" aria-label="Readiness stages">
        <ol className="shell progress">
          {[
            { key: "profile", label: "Profile", num: "01" },
            { key: "understand", label: "Understand", num: "02" },
            { key: "prepare", label: "Prepare", num: "03" },
            { key: "packet", label: "Packet", num: "04" },
          ].map((s) => (
            <li key={s.key}>
              <button
                type="button"
                aria-current={currentStep === s.key ? "step" : undefined}
                onClick={() => handleStepClick(s.key)}
              >
                <span className="step-number">{s.num}</span>
                <span className="step-label">{s.label}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <main className="shell">
        <div className="program-context">
          <div className="program-context-inner">
            <p className="mono panel-kicker">Preparing for</p>
            <h3 className="program-name">Harbor View Homes · LIHTC</h3>
            <p className="program-details">
              Low-Income Housing Tax Credit program · 2026 income limits ·
              Household of 3 · Annual limit: $74,280
            </p>
            <p className="program-note">
              RealDoor helps you gather and organize what this property needs.
              It does not decide if you qualify — a qualified person reviews your application.
              This version focuses on one program to prove depth and correctness.
            </p>
          </div>
        </div>

        <ProfileStage onIncomeConfirmed={handleIncomeConfirmed} />
        <UnderstandStage
          monthlyIncome={confirmedIncome}
          householdSize={householdSize}
          confirmed={incomeConfirmed}
          announce={announce}
        />
        <PrepareStage
          confirmed={incomeConfirmed}
          announce={announce}
          onDeleteSession={handleDeleteSession}
        />
        <DiscoverStage announce={announce} />
      </main>

      <footer className="site-footer">
        <div className="shell footer-inner">
          <p className="footer-tagline">AI assisted. Human approved. Powered by NLP.</p>
          <p className="footer-credits">
            Built by La&apos;Shara Cordero /{" "}
            <a href="https://earlgreyhot1701d.github.io/Clew-Labs/" target="_blank" rel="noopener noreferrer">Clew Labs</a>
            {" · "}
            <a href="https://www.linkedin.com/in/la-shara-cordero-a0017a11/" target="_blank" rel="noopener noreferrer">LinkedIn</a>
            {" · "}
            <a href="https://linktr.ee/ljcordero" target="_blank" rel="noopener noreferrer">Linktree</a>
          </p>
        </div>
      </footer>
    </>
  );
}
