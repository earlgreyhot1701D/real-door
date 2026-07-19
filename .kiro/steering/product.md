# Product — RealDoor

> Kiro steering file. Always-on context. This is the WHAT and the WHY. Read `responsible-ai.md`, `security.md`, `tech.md`, and `structure.md` alongside it.

## One line
A renter-side application-readiness copilot for affordable housing. It turns synthetic household documents into a human-confirmed profile, explains one program's rules with citations, flags missing or expired documents, and prepares a renter-controlled readiness packet. It never decides eligibility.

## Who it is for
Maria works two jobs and is trying to move her family into a LIHTC unit. Listings and requirements are fragmented, every program asks for different paperwork, and a small error can delay her application for weeks. RealDoor reduces avoidable friction. It does not automate the decision.

## The governing sentence (repeat it in the UI)
The AI extracts, explains, retrieves, calculates, and prepares. The renter confirms. A qualified human decides.

## Design principles
- ONE METRO — keep the context local.
- ONE PROGRAM — freeze the rules for one program and one rule year.
- SYNTHETIC DOCS — protect real renters. Never use real applicant data.
- HUMAN DECISION — no gatekeeping. The tool is assistive, not adjudicative.

## The three-stage journey (build one end to end, depth over breadth)
1. **Profile — human-confirmed extraction.** Upload synthetic pay stubs or benefit letters. Extract only allowlisted fields, each with a source box and a confidence readout. Require confirmation or correction before any value is reused.
2. **Understand — cited rules and deterministic math.** Use a versioned corpus for one program and rule year. Show the confirmed value, threshold, formula, source, and effective date. Abstain when the rule or input is uncertain. Never label the renter eligible.
3. **Prepare — renter-controlled packet.** Flag missing or expired items against a gold checklist. Let the renter preview, edit, download, and delete. Never auto-send a profile or packet to a property or provider.

## MUST (this phase)
- MUST implement all three stages end to end as one working renter journey.
- MUST show, for every extracted value, its source box and confidence, and require confirm/correct before reuse.
- MUST compute income math in the deterministic rule engine, never in the model.
- MUST cite every rules answer with source and effective date, and abstain when uncertain.
- MUST flag missing/expired items and let the renter preview, edit, download, delete.
- MUST pass the six-step acceptance demo (see the spec).

## STUB (v2, leave a labeled comment with implementation notes, do not build)
- STUB multi-program and multi-metro support. This phase is one program, one metro.
- STUB the "Discover" transparent property lookup (Tavily). Guardrails documented, not wired.
- STUB accounts, login, and saved history. This phase has no login.
- STUB multi-document reconciliation (combining several pay stubs). This phase is one document, one field path proven deep.
- STUB translations/multi-language. English first, structure ready for i18n.

## NEVER (product-level, non-negotiable)
- NEVER approve, deny, score, rank, or determine eligibility.
- NEVER infer protected traits or use demographic, behavioral, or landlord-revenue features.
- NEVER auto-send anything to a property or provider on the renter's behalf.
- NEVER train on uploads. NEVER persist raw document contents.
- NEVER present a "decide for me" answer. Deflect to the rule, the confirmed input, and the calculation.

*AI assisted. Human approved. Powered by NLP.*
