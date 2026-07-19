# Architecture & Risk Note — RealDoor

## What it is
A renter-side application-readiness copilot for one LIHTC program (Harbor View Homes, 2026). It extracts fields from synthetic documents, explains rules with citations, computes income math deterministically, and produces a renter-controlled readiness packet. It never decides eligibility.

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router) + TypeScript |
| AI/Model | Amazon Bedrock — Claude Sonnet 4.6 via the Converse API with forced tool-use |
| Rule engine | Pure TypeScript, zero model involvement, fixture-anchored |
| Discover | Tavily search API — official public sources only, availability always "unknown" |
| State | Ephemeral, in-memory per session. No database. |
| Auth | Bedrock API key via `AWS_BEARER_TOKEN_BEDROCK` (or IAM keys). Server-side only. |
| Deploy | Vercel (or AWS-native with IAM role) |

## Architecture diagram (text)

```
┌─────────────┐     ┌────────────────────────────────────────┐
│   Browser   │────▶│  Next.js App Router (Vercel/AWS)       │
│  (React UI) │◀────│                                        │
└─────────────┘     │  /api/extract   → Bedrock (Claude)     │
                    │  /api/rules     → Frozen corpus lookup  │
                    │  /api/calculate → Pure rule engine      │
                    │  /api/discover  → Tavily (public data)  │
                    │                                        │
                    │  middleware.ts  → CORS lock to origin   │
                    │  rate-limit.ts  → 20 req/min per key   │
                    └────────────────────────────────────────┘
```

## Key controls

1. **No decisioning.** The model has no tool to approve, deny, score, rank, send, or persist. Capability is removed, not just discouraged.
2. **Deterministic math.** Income annualization and limit comparison are pure functions. The model never touches `lib/rule-engine/`. 45 unit tests anchor this.
3. **Untrusted input.** All document text is wrapped in explicit delimiters and treated as data. An adversarial fixture proves embedded instructions are ignored.
4. **Allowlist enforcement.** Only 4 field IDs are extractable (`monthlyIncome`, `householdSize`, `payFrequency`, `benefitAmount`). Anything else is discarded by `sanitizeExtraction()`.
5. **No source = dropped.** A field without a source quote is never shown to the renter.
6. **Abstention.** When the corpus has no confident match, the system says "I'm not certain about this one. A qualified person should check it."
7. **Ephemeral.** No database, no persistent storage. Session delete = page reload = all state gone.
8. **Rate limiting.** Per-key/IP limiter on model-backed routes. Returns 429, never a blank screen.
9. **Accessible.** Skip link, visible focus, labeled controls, aria-live announcements, no color-only status, `prefers-reduced-motion` honored.
10. **Discover guardrails.** Queries only official domains (hud.gov, huduser.gov). All results labeled "Availability: Unknown." Unfiltered set shown. Never ranks or predicts acceptance. Fetched text wrapped as untrusted.

## Risks and mitigations

| Risk | Mitigation |
|------|-----------|
| Model hallucinates a field value | Allowlist + source requirement + renter confirmation gate |
| Prompt injection via document | Delimiter wrapping + safety suffix + capability removal (no tool can approve/score) |
| Credential exposure | Server-side only; no `NEXT_PUBLIC_` secrets; CORS locked; middleware enforces origin |
| Stale rules | Rules are frozen to one program + year with explicit effective dates; abstains when uncertain |
| Accessibility gaps | Built from an approved mock with skip link, focus, aria-live; full WCAG audit recommended for production |
| Model unavailability | `USE_MOCK_MODEL=1` fallback keeps the journey demoable |

## What this is NOT

- Not a decision system. It cannot approve or deny.
- Not a scoring tool. No number produced here is a "score."
- Not a data store. Nothing persists beyond the browser session.
- Not an auto-sender. The renter manually downloads and delivers their packet.

*AI assisted. Human approved. Powered by NLP.*
