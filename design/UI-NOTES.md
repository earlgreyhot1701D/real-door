# UI notes — RealDoor

`realdoor-mock.html` is the approved visual direction. It is the source of truth for look, tokens, and copy. Build components to match it, then wire data.

## What the mock already proves
- Header with persistent status strip and a "Delete my session" control.
- Hero + "careful boundary" principles (AI extracts / you confirm / a qualified person decides).
- 4-step progress nav: Profile, Understand, Prepare, Packet.
- Stage 01 Profile: upload zone, live summary that updates on confirm, one field card with source box + confidence + confirm/correct, inline validation error, aria-live announcements.

## What is intentionally NOT built yet (build from the spec, block by block)
- Stage 02 Understand: RulesAnswer (cited + ABSTAIN) and CalcPanel (deterministic, effective date).
- Stage 03 Prepare: Checklist (Present/Missing/Expired, icon+text+color) and PacketPreview (preview/edit/download/delete).
- The extraction currently reveals one field. Keep the depth-over-breadth approach: one field path proven fully.

## Design tokens (already in the mock, keep them)
paper #F5F1E8 - paper2 #ECE6D8 - card #FBF8F1 - ink #1C2B33 - teal #1F5C5A - teal2 #2E7A76 - accent #C2703D - good #2E6E4E - warn #B5852A - muted #6C7680 - line #DED6C6

## Accessibility already in place (keep it as you extend)
Skip link, visible focus, labeled controls, aria-live region, prefers-reduced-motion, status not by color alone, textContent not innerHTML.

## Port to React
Move the inline mock into components under `components/` (one file each, see structure.md). Keep the exact copy, especially: "Nothing here is reused until you confirm it," "computed by the rule engine, not the AI," "RealDoor never sends this for you," and the abstain line.
