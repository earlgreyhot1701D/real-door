// Structured run log. Metadata ONLY. NEVER log raw document contents, extracted PII values, or keys.

export interface LogEntry {
  step: string;
  action: string;
  ruleVersion?: string;
  ok: boolean;
  ms?: number;
}

/** Log a step. Redacts by design: this signature has no place to pass raw contents. */
export function logStep(entry: LogEntry): void {
  // eslint-disable-next-line no-console
  console.log(JSON.stringify({ ts: new Date().toISOString(), ...entry }));
}

// STUB (v2): ship to a real sink (CloudWatch / Logtail) with retention limits and PII scanning.
