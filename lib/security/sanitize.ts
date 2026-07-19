// Shared input validation + sanitization. Used on the server for every request body.
// Never trust the front end. Validate shape and bounds before anything reaches the model or engine.

export function isFiniteNumberInRange(value: unknown, min: number, max: number): value is number {
  return typeof value === "number" && Number.isFinite(value) && value >= min && value <= max;
}

/** Parse a money string ("3,240.00") to a number. Returns null on invalid input. */
export function parseMoney(input: unknown): number | null {
  if (typeof input === "number") return Number.isFinite(input) ? input : null;
  if (typeof input !== "string") return null;
  const cleaned = input.replace(/[^0-9.]/g, "");
  if (cleaned === "" || cleaned === ".") return null;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : null;
}

/** Validate a rules question string. Bounded length, string only. */
export function validateQuestion(input: unknown): string | null {
  if (typeof input !== "string") return null;
  const q = input.trim();
  if (q.length === 0 || q.length > 500) return null;
  return q;
}

// STUB (v2): centralize with a zod schema per route and share types with the client.
