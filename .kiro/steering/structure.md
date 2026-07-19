# Structure — RealDoor

> Kiro steering file. Where code goes. One file, one responsibility. No god files. Every file opens with a one-line responsibility docstring.

```
realdoor/
  app/
    layout.tsx                 # root layout, fonts, skip link
    page.tsx                   # single page: Profile -> Understand -> Prepare -> Packet
    api/
      extract/route.ts         # POST: server-side extraction (Bedrock, untrusted input wrapped)
      rules/route.ts           # POST: cited rules answer or ABSTAIN
      calculate/route.ts       # POST: calls the pure rule engine (no model)
  components/                  # one component per file, built from design/realdoor-mock.html
    ProfileStage.tsx
    FieldCard.tsx              # value + source box + confidence + confirm/correct
    LiveSummary.tsx            # updates when a field is corrected
    UnderstandStage.tsx
    RulesAnswer.tsx            # cited answer, effective date, ABSTAIN state
    CalcPanel.tsx              # deterministic math, "computed by the rule engine, not the AI"
    PrepareStage.tsx
    Checklist.tsx              # Present / Missing / Expired, icon + text + color (never color only)
    PacketPreview.tsx          # preview, edit, download, delete. "RealDoor never sends this for you."
  lib/
    rule-engine/
      index.ts                 # pure deterministic math. Model never touches this.
      types.ts                 # engine input/output types
    extraction/
      extract.ts               # Bedrock (Claude) Converse + forced tool-use -> validated JSON
      schema.ts                # allowlist + zod/JSON schema for extracted fields
    rules/
      explain.ts               # constrained rules answer over the frozen corpus, or ABSTAIN
    security/
      sanitize.ts              # input validation + sanitization (client + server shared)
      untrusted.ts             # wrap and neutralize untrusted document/model text
      rate-limit.ts            # per-session/IP limiter for model-backed routes
      log.ts                   # structured run log (metadata only, never raw doc contents)
    discover/
      tavily.ts                # STUB v2: transparent property lookup, guardrails documented
  data/
    mock/mockProfile.ts        # typed mock, mirrors design/realdoor-mock.html
    schemas/extraction.schema.json
    fixtures/rule-engine.fixtures.json   # engine must reproduce these EXACTLY
  design/
    realdoor-mock.html         # the approved UI direction (source of truth for look/copy)
    UI-NOTES.md
  .kiro/
    steering/                  # this folder
    specs/realdoor/            # requirements, design, tasks
    hooks/                     # light self-check hooks
```

## Rules
- Build against mock data first (`data/mock`), then wire APIs. Never wire an API to a broken layout.
- Deterministic logic lives in `lib/rule-engine` and `lib/rules` corpus lookups. AI flavor lives in `lib/extraction` and the narrative. Keep them separated.
- Components read typed data; they do not call the model directly. Routes do.
- If it is a v2 feature, add a labeled STUB comment with implementation notes. Do not build half-features.
