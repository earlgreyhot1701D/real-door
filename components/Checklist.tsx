// Checklist: Present/Missing/Expired status per item. Icon + text + color (never color only).
"use client";

export interface ChecklistItem {
  item: string;
  status: "Present" | "Missing" | "Expired";
  date: string | null;
  note?: string;
}

interface ChecklistProps {
  items: ChecklistItem[];
}

const STATUS_CONFIG = {
  Present: { icon: "✓", className: "checklist-present", label: "Present" },
  Missing: { icon: "✗", className: "checklist-missing", label: "Missing" },
  Expired: { icon: "⚠", className: "checklist-expired", label: "Expired" },
} as const;

export default function Checklist({ items }: ChecklistProps) {
  return (
    <div className="checklist" role="list" aria-label="Document readiness checklist">
      {items.map((entry) => {
        const config = STATUS_CONFIG[entry.status];
        return (
          <div
            key={entry.item}
            className={`checklist-item ${config.className}`}
            role="listitem"
          >
            <span className="checklist-icon" aria-hidden="true">{config.icon}</span>
            <div className="checklist-content">
              <span className="checklist-name">{entry.item}</span>
              <span className="checklist-status">
                {config.label}
                {entry.date && ` · ${entry.date}`}
              </span>
              {entry.note && <p className="checklist-note">{entry.note}</p>}
            </div>
          </div>
        );
      })}
    </div>
  );
}
