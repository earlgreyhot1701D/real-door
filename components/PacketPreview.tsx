// PacketPreview: preview, edit, download, delete. "RealDoor never sends this for you."
"use client";

import { useState, useCallback } from "react";

interface PacketPreviewProps {
  ready: boolean;
  personName: string;
  announce: (message: string) => void;
  onDelete: () => void;
}

function generatePacketText(personName: string): string {
  return [
    "REALDOOR READINESS PACKET",
    "=========================",
    "",
    `Prepared for: ${personName}`,
    `Generated: ${new Date().toISOString().split("T")[0]}`,
    "",
    "This packet was prepared by the renter using RealDoor.",
    "RealDoor never sends this for you.",
    "A qualified person makes the decision.",
    "",
    "--- END ---",
  ].join("\n");
}

export default function PacketPreview({ ready, personName, announce, onDelete }: PacketPreviewProps) {
  const [editing, setEditing] = useState(false);
  const [packetText, setPacketText] = useState(() => generatePacketText(personName));

  const handleDownload = useCallback(() => {
    // Client-side generation. No server persistence of documents.
    const blob = new Blob([packetText], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `realdoor-packet-${personName.replace(/\s+/g, "-").toLowerCase()}.txt`;
    a.click();
    URL.revokeObjectURL(url);
    announce("Packet downloaded.");
  }, [packetText, personName, announce]);

  const handleDelete = useCallback(() => {
    onDelete();
    announce("Packet deleted. Session data cleared.");
  }, [onDelete, announce]);

  const handleEdit = useCallback(() => {
    setEditing(true);
    announce("Packet is now editable.");
  }, [announce]);

  const handleDoneEditing = useCallback(() => {
    setEditing(false);
    announce("Edits saved to packet.");
  }, [announce]);

  return (
    <div className="packet-preview">
      <p className="mono panel-kicker">Your readiness packet</p>
      <h3 className="packet-title">
        {ready ? "Packet ready for review" : "Complete the profile to build a packet"}
      </h3>

      {ready && (
        <div className="packet-content">
          <div className="packet-text-preview">
            {editing ? (
              <textarea
                className="packet-textarea"
                value={packetText}
                onChange={(e) => setPacketText(e.target.value)}
                aria-label="Edit packet contents"
                rows={10}
              />
            ) : (
              <pre className="packet-text-readonly" aria-label="Packet preview">
                {packetText}
              </pre>
            )}
          </div>

          <div className="packet-actions">
            {editing ? (
              <button className="secondary" type="button" onClick={handleDoneEditing}>
                Done editing
              </button>
            ) : (
              <button className="text-control" type="button" onClick={handleEdit}>
                Edit packet
              </button>
            )}
            <button className="primary" type="button" onClick={handleDownload}>
              Download packet
            </button>
            <button className="secondary" type="button" onClick={handleDelete}>
              Delete packet
            </button>
          </div>
        </div>
      )}

      <p className="packet-notice">
        RealDoor never sends this for you. You decide where it goes.
      </p>
    </div>
  );
}
