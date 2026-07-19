# Tasks — RealDoor

> Kiro spec. Block-by-block build order. QA checkpoint (PASS/FAIL) after each block before moving on. Test-first where noted. Do not refactor code outside the block you are on.

## Block 0 — Scaffold (30 min)
- [ ] Next.js 14 + TS app boots. Fonts and tokens from `design/realdoor-mock.html` in `app/layout.tsx`.
- [ ] `.env.example` copied to `.env.local`; keys server-side only.
- **QA (PASS/FAIL):** `npm run dev` serves a blank shell with header, status strip, and the 4-step progress nav. No keys in client bundle.

## Block 1 — Rule engine, PURE, test-first (CROWN JEWEL)
- [ ] Write `lib/rule-engine/types.ts` and `index.ts` as pure functions.
- [ ] Write tests against `data/fixtures/rule-engine.fixtures.json` FIRST.
- [ ] Implement until all fixtures pass, including the partial-data and no-source-downgrade cases.
- **QA (PASS/FAIL):** every fixture passes exactly. Engine returns neutral numbers, never a verdict. The model is nowhere in this file.
- **Hook:** test-gate blocks on this.

## Block 2 — Extraction (build against a mock model first)
- [ ] `lib/extraction/schema.ts` (allowlist) + `data/schemas/extraction.schema.json`.
- [ ] `lib/extraction/extract.ts` against a MOCK model returning fixed JSON.
- [ ] Validate output against the schema; drop any field lacking a source; bounded retry; typed error.
- [ ] Then wire real Amazon Bedrock (Claude Sonnet) via the Converse API with forced tool-use for structured output, server-side, credentials via the AWS chain.
- **QA (PASS/FAIL):** mock path returns allowlisted fields with sources and confidence; a field without a source is dropped, not shown. Contract-check hook is green.

## Block 3 — Profile stage UI (mock data first)
- [ ] `ProfileStage`, `FieldCard`, `LiveSummary` from the mock. Read `data/mock/mockProfile.ts`.
- [ ] Confirm/correct flow; correcting monthly income updates the annualized figure live.
- [ ] Client-side validation mirrors server schema.
- **QA (PASS/FAIL):** acceptance demo steps 1 and 2 work. Keyboard operable, aria-live announces "Field confirmed".

## Block 4 — Understand stage (rules + calc)
- [ ] `lib/rules/explain.ts` over the frozen corpus; returns citation + effectiveDate or `{abstain:true}`.
- [ ] `RulesAnswer` (cited answer + ABSTAIN state) and `CalcPanel` (calls `/api/calculate` -> rule engine).
- **QA (PASS/FAIL):** acceptance steps 3 and 4. Abstain path shows the human-review message with no verdict. Calc shows effective date and "computed by the rule engine, not the AI".

## Block 5 — Prepare + Packet
- [ ] `Checklist` (Present/Missing/Expired, icon+text+color) and `PacketPreview` (preview/edit/download/delete).
- **QA (PASS/FAIL):** acceptance step 5. Expired item shows note. Download works client-side. "RealDoor never sends this for you" visible. No auto-send path exists.

## Block 6 — Security hardening + injection/refusal/deletion
- [ ] `lib/security/`: sanitize, untrusted wrapping, rate-limit, structured log.
- [ ] Add adversarial fixture doc; test proves embedded instructions are ignored.
- [ ] Refusal: "decide for me" deflects to rule/input/calculation. Session delete clears state + announces.
- **QA (PASS/FAIL):** acceptance step 6. All three tests pass. Run the pre-ship checklist hook; fix every red.

## Block 7 — Deploy
- [ ] Deploy to Vercel. Env vars set server-side. CORS locked to origin.
- **QA (PASS/FAIL):** live URL runs the full journey. `DEPLOY.md` rollback plan verified.

## STUB tasks (do NOT build this phase; leave labeled comments)
- [ ] STUB Discover (Tavily) — guardrails only.
- [ ] STUB auth + accounts + saved history.
- [ ] STUB storage + RLS + monitoring/alarms + CI.
- [ ] STUB multi-program, multi-metro, multi-document, i18n.
