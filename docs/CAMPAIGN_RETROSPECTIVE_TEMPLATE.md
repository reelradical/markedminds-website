# [Campaign Name] Postmortem

**Copy this file to `docs/[CAMPAIGN_NAME]_POSTMORTEM.md` and fill in every
section below.** Modeled on `docs/BLACK2SCHOOL_POSTMORTEM.md` — read that
one first as a worked example of the level of specificity expected here.

**Campaign window:** [start date] → [end date]
**Report window covered:** [dates the analytics report actually pulled]
**Status:** [Concluded / Ongoing]
**Related:** [link the analytics report file, and any other campaign-specific docs]

Before filling this in, run through `docs/CAMPAIGN_QA_PLAYBOOK.md` one more
time against what actually shipped (not what was planned) — the gaps you
find doing that belong in this document.

---

## What worked

*List concrete things that functioned correctly, each with the evidence
that confirms it — not "the email system worked" but "X emails sent, Y
delivered, verified via [specific check]." If you can't point to how you
verified something worked, don't claim it worked.*

-
-
-

## What didn't work

*Same rule: concrete, verifiable, specific. Include anything discovered
during the campaign that wasn't caught during pre-launch QA — those are
the most valuable entries here, since they're exactly what next
campaign's QA pass should catch instead.*

-
-
-

## What we learned

*Insights that go beyond "X was broken" — patterns, architectural
lessons, process gaps. Ask: what would we tell a version of ourselves
starting this campaign over, before any code was written?*

-
-
-

## What surprised us

*Anything where the data didn't match expectations, and — critically — be
honest about what's confirmed vs. still an open question. It is better to
list three plausible explanations for a discrepancy than to assert a
confident wrong one. If something is genuinely unresolved, say so and
list it as an action item to actually resolve, not just explain away.*

-
-
-

## What should never happen again

*The bright-line list. Each entry here should be specific enough that
someone doing pre-launch QA next time can check for it directly (compare
to `docs/CAMPAIGN_QA_PLAYBOOK.md` — if something belongs there and isn't
yet, add it while you're here).*

-
-
-

---

## Immediate Action Items

Rank by expected impact vs. effort. Effort: S = under an hour, M = a few
hours, L = a day or more. Don't rank everything "Critical" — force real
prioritization, and be honest when something is genuinely Low.

### Critical

| # | Item | Why | Effort |
|---|---|---|---|
| 1 | | | |

### High

| # | Item | Why | Effort |
|---|---|---|---|
| 1 | | | |

### Medium

| # | Item | Why | Effort |
|---|---|---|---|
| 1 | | | |

### Low

| # | Item | Why | Effort |
|---|---|---|---|
| 1 | | | |

---

## Data appendix

*Link or paste the raw source data this postmortem is based on — the
report script's raw JSON output, specific Airtable record IDs excluded as
spam, GA4/Vercel/Clarity screenshots if the script-based pull wasn't
available. Anyone reading this six months from now should be able to
trace every claim above back to a real number here.*

- Analytics report: `reports/[report file]`
- Raw data pull: `reports/[raw json file]`
- Spam records excluded (if any): [record IDs]
- Any manual exports used (Clarity dashboard, etc.): [links/files]
