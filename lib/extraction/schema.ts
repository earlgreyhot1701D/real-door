// Field allowlist + runtime validation for extracted fields.
// A field not on this allowlist is discarded. A field without a source is downgraded (dropped), never shown.

export const FIELD_ALLOWLIST = ["monthlyIncome", "householdSize", "payFrequency", "benefitAmount"] as const;
export type FieldId = (typeof FIELD_ALLOWLIST)[number];

export interface ExtractedField {
  id: FieldId;
  label: string;
  value: number | string;
  source: { document: string; quote: string; coordinate: string };
  confidence: { label: "High" | "Medium" | "Low"; percent: number };
}

export interface ExtractionResult {
  documentName: string;
  fields: ExtractedField[];
}

/** Keep only allowlisted fields that have a real source. No source => dropped (no found without a source). */
export function sanitizeExtraction(raw: unknown, documentName: string): ExtractionResult {
  const fields: ExtractedField[] = [];
  const list = (raw as { fields?: unknown[] })?.fields ?? [];
  for (const f of list as ExtractedField[]) {
    if (!f || !FIELD_ALLOWLIST.includes(f.id as FieldId)) continue;
    if (!f.source || !f.source.document || !f.source.quote) continue; // no source => drop
    if (!f.confidence || typeof f.confidence.percent !== "number") continue;
    fields.push(f);
  }
  return { documentName, fields };
}

// STUB (v2): validate with a shared zod schema so client and server use one source of truth.
