# Requirements — RealDoor

> Kiro spec. EARS-style acceptance criteria. Depth and correctness and renter control matter more than broad coverage. Build ONE program, ONE metro, ONE working journey.

## R1 — Profile: human-confirmed extraction
**User story:** As a renter, I want to upload a synthetic document and see exactly what was extracted and where it came from, so I can confirm or correct it before anything is reused.

- WHEN a renter uploads a synthetic pay stub or benefit letter, the system SHALL extract only allowlisted fields.
- WHEN a field is extracted, the system SHALL display its value, a source box quoting the origin, and a confidence readout.
- The system SHALL NOT reuse any extracted value downstream UNTIL the renter confirms it.
- WHEN a renter corrects a field and confirms, the system SHALL update all downstream values that depend on it (e.g. annualized income).
- IF the corrected value is invalid (non-numeric, ≤ 0 for income), THEN the system SHALL show a labeled inline error and SHALL NOT confirm.
- The confidence readout SHALL describe the extraction, never the person.

## R2 — Understand: cited rules and deterministic math
**User story:** As a renter, I want the program's rules explained with a real citation and the math shown, so I can trust the numbers without being told a verdict.

- WHEN a renter asks a rules question, the system SHALL answer only from the frozen corpus for the configured program and rule year.
- WHEN the system answers a rules question, it SHALL show an authoritative citation with source and effective date.
- IF the rule or the input is uncertain, THEN the system SHALL ABSTAIN and route to a human, and SHALL NOT produce an eligibility statement.
- WHEN income math is shown, the system SHALL compute it in the deterministic rule engine, not the model, and SHALL label it as such.
- The calculation SHALL show inputs (from confirmed profile), threshold, formula, result, and the effective date of the limits used.
- The system SHALL NEVER render eligible, ineligible, a score, or a rank.

## R3 — Prepare: renter-controlled packet
**User story:** As a renter, I want to see what's missing or expired and assemble a packet I control, so I decide what happens next.

- The system SHALL flag each required item as Present, Missing, or Expired against a gold checklist, shown with icon AND text AND color.
- WHEN an item is expired, the system SHALL show a helpful note with the relevant date.
- The renter SHALL be able to preview, edit, download, and delete the packet.
- The system SHALL NEVER auto-send a profile or packet to a property or provider.

## R4 — Safety, privacy, refusal (cross-cutting)
- WHEN a renter asks "am I eligible / will I get in / decide for me", the system SHALL deflect to the rule, the confirmed input, and the calculation, and SHALL NOT give a verdict.
- The system SHALL treat all uploaded/fetched text as untrusted; embedded instructions SHALL NOT alter behavior, tools, rules, or data access.
- The system SHALL keep API keys server-side, validate requests server-side, and rate-limit model-backed routes.
- The system SHALL process documents ephemerally and SHALL NOT persist raw document contents.
- WHEN a renter deletes the session, the system SHALL clear all state and confirm via an accessible announcement.

## R5 — Accessibility (cross-cutting, WCAG 2.2 AA)
- The full journey SHALL be operable by keyboard with visible focus.
- Controls and errors SHALL be labeled; status SHALL NOT rely on color alone.
- Completions SHALL be announced via aria-live; the app SHALL honor prefers-reduced-motion.

## Acceptance demo (must run start to finish)
1. Upload a synthetic document and show extracted evidence.
2. Correct one field and show that downstream values update.
3. Ask a rules question and show the authoritative citation.
4. Show the deterministic calculation and its effective date.
5. Identify a missing or expired item, then export the packet.
6. Run the refusal, prompt-injection, and session-deletion tests.

## Stretch (STUB v2) — Discover
Transparent property discovery from public location data. Renter-selected filters only; show the unfiltered set; label availability as unknown unless separately supplied; NEVER predict acceptance or rank by protected traits or proxies. Guardrails documented in `lib/discover/tavily.ts`; not wired this phase.
