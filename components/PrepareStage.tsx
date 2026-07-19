// PrepareStage: checklist (Present/Missing/Expired) + packet preview/download/delete.
"use client";

import Checklist, { type ChecklistItem } from "./Checklist";
import PacketPreview from "./PacketPreview";
import { MOCK_PROFILE } from "../data/mock/mockProfile";

interface PrepareStageProps {
  confirmed: boolean;
  announce: (message: string) => void;
  onDeleteSession: () => void;
}

export default function PrepareStage({ confirmed, announce, onDeleteSession }: PrepareStageProps) {
  const checklistItems: ChecklistItem[] = MOCK_PROFILE.checklist;

  return (
    <section aria-labelledby="prepare-title" id="prepare">
      <div className="stage-heading">
        <p className="stage-index mono">Stage 03 · Prepare</p>
        <div>
          <h2 id="prepare-title">Prepare your readiness packet.</h2>
          <p>
            Review what&apos;s present, what&apos;s missing, and what&apos;s expired.
            Then download a packet you control.
          </p>
        </div>
      </div>

      <div className="prepare-workspace">
        <div className="panel prepare-panel">
          <p className="mono panel-kicker">Document checklist</p>
          <h3 className="prepare-checklist-title">What you need</h3>
          <Checklist items={checklistItems} />
        </div>

        <div className="panel prepare-panel">
          <PacketPreview
            ready={confirmed}
            personName={MOCK_PROFILE.person.name}
            announce={announce}
            onDelete={onDeleteSession}
          />
        </div>
      </div>
    </section>
  );
}
