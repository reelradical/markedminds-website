# Black2SchoolMVMT Campaign Postmortem

**Campaign window:** conference occurred within the last two weeks (report window: 2026-07-22 → 2026-08-05)
**Status:** Concluded. This is a retrospective and forward-looking planning document — no production code was changed to produce it.
**Related:** `reports/conference-analytics-report-2026-07-22_to_2026-08-05.md` (source data), `docs/CAMPAIGN_TRACKING_STANDARDS.md`, `docs/CAMPAIGN_QA_PLAYBOOK.md`, `docs/CAMPAIGN_RETROSPECTIVE_TEMPLATE.md`

---

## What worked

- **Spam protection shipped and held.** The honeypot + timing guard (deployed same week as the spam was discovered) correctly distinguishes bot submissions from real ones — verified directly: 3 of 4 pre-fix Focus + FLEX Intake Queue records were confirmed bot traffic and excluded from reporting; 1 was genuine.
- **The non-blocking email/Airtable architecture never broke.** Notification email gates the Airtable write, confirmation email is best-effort, Airtable failure never blocks a user-facing success. No incidents traced to this layer this campaign.
- **`/black2school` and `/black2school/thank-you` metadata is correctly configured.** Both pages already have deliberate `robots: { index: false, follow: true }` — a documented, intentional choice (public/shareable but not search-indexed), not an oversight. Open Graph and Twitter Card tags are fully wired with a real 1200×630 image (`public/social/og-black2school.jpg`), title, and description sourced from `campaign.metadata`.
- **The Square Payment Links + redirect-to-thank-you flow is architecturally sound.** The purchase-click event (`black2school_purchase_fixed`) fires on click, before navigation, and opens Square in a new tab (`target="_blank"`) — so it isn't racing an unload event. The mechanism itself is not obviously broken (see "What surprised us" for why the *data* still doesn't fully add up).
- **The Airtable Intake Queue remains the most trustworthy signal in the whole pipeline.** It's real, durable, queryable, and — once spam is excluded — gave an unambiguous count (1 genuine Focus + FLEX signup) that no analytics platform could contest.
- **The reporting pipeline itself now exists and works.** Three of four analytics sources (Vercel, GA4, Airtable) are live, scriptable, and reproducible for the next campaign in minutes, not hours of manual dashboard digging.

## What didn't work

- **QR code and social links carry zero UTM parameters.** The printed conference piece's QR code encodes a bare `https://markedminds.com/black2school` — no `utm_source`, `utm_medium`, or `utm_campaign`. Result: QR scans, LinkedIn clicks, and Instagram clicks are all structurally indistinguishable from generic direct traffic. This is not a data-processing gap — the information was never captured in the first place, and it's not retroactively recoverable for this campaign.
- **`/api/contact` and `/api/newsletter` don't persist anything.** Both routes validate and return success, but `/api/contact` only `console.log`s the submission and `/api/newsletter` doesn't even do that. Neither is wired to Airtable, GA4, or any durable store. Two of the report's requested "Conversions" line items (contact inquiries, newsletter signups) simply have no data to report — not because the report failed to find it, but because nothing was ever recorded.
- **Sitewide traffic totals are dominated by bot/crawler activity**, confirmed two independent ways: GA4 geography shows 88% of users from Iran + Netherlands (implausible for this audience), and Vercel shows nine unrelated pages with near-identical visitor counts and a uniform ~1.2–1.4 pageviews/visitor ratio — the signature of a crawler walking every route once. This means every "total visitors" headline number from this campaign needs a caveat before it's usable, and probably needs bot filtering enabled at the platform level before the *next* campaign.
- **Clarity's API couldn't retroactively cover the report window.** Its Data Export API is hard-capped at 1–3 days of lookback regardless of when it's queried, and its 10-requests/project/day quota was exhausted by same-day verification testing before a real data pull completed. Behavioral data (scroll depth, engagement time by page, dead/rage clicks) for this campaign is effectively unavailable now and will stay that way — this only works if pulled within days of the traffic happening.

## What we learned

- **A "click" event and a "purchase" event are not the same event, and treating them as one is a real architecture gap.** `black2school_purchase_fixed` measures *intent to purchase* (clicked through to Square), not *confirmed purchase*. Square opens in a new tab, so there's no reliable client-side signal that a purchase actually completed — only that someone clicked toward it.
- **`noindex` and "not crawlable" are different guarantees.** The thank-you page correctly excludes itself from search results, but `robots.ts` has no `Disallow` rule preventing a crawler or scanner from *fetching* it directly. A page that should only be reachable via a post-purchase redirect is, in practice, openly fetchable by anything that finds the URL.
- **First-party analytics (Vercel) and third-party analytics (GA4) don't always agree on session boundaries**, especially across a `target="_blank"` tab switch — worth designing tracking with that in mind rather than assuming one continuous session end-to-end.
- **Manual dashboard-checking doesn't scale across three analytics platforms with three different auth models, quota systems, and data-latency windows.** Building the reporting script once now makes every future campaign's report a same-day exercise instead of a multi-hour one — but it also means quota limits (Clarity specifically) need to be respected deliberately, not burned on ad hoc test runs.

## What surprised us

- **Two sessions reached `/black2school/thank-you` — a page only reachable via a completed Square purchase redirect — but zero `black2school_purchase_fixed` click events fired in the same window.** This is a genuine, unresolved discrepancy, not glossed over here. Three real possibilities, none confirmed:
  1. **Bot/crawler direct hit.** Nothing in `robots.txt` blocks fetching the URL, and if it was discoverable (linked anywhere crawlable, or guessed), a bot could land there directly with no click ever happening.
  2. **Cross-tab session-stitching artifact.** GA4 shows `/black2school/thank-you` as the *landing page* (first page of session) for both sessions — meaning GA4 did not attribute them as continuations of a same-session click-through. If the click happened in the original tab and the purchase completed in the new tab, this is plausible but not verified.
  3. **GA4 processing latency.** Standard GA4 property reports have a normal data-processing delay (often hours). If either of these thank-you visits happened very recently relative to when the report was run, the corresponding click event may simply not have finished processing yet.
  This needs a direct fix (see Action Items), not just an explanation.
- **Real, attributable conversion volume was very low relative to the print piece's production investment.** One genuine Focus + FLEX signup, 3 service-select interactions, 1 offer click, ~9–10 real `/black2school` sessions. Whether that's "the print piece underperformed" or "conversations happened face-to-face at the conference and never touched the tracked digital funnel" is a real open question the data cannot answer on its own.
- **The bot traffic pattern is sitewide, not campaign-specific** — this wasn't a Black2School problem, it was already happening across `/donate`, `/partners`, `/impact`, and other unrelated pages. The campaign just happened to be the lens that surfaced it.

## What should never happen again

- **Never ship a QR code or shareable campaign link without UTM parameters baked in.** This is the single most preventable gap from this campaign — it cost nothing to avoid and cannot be fixed after printing.
- **Never treat a client-side click event as proof of a completed transaction**, especially across a tab boundary or third-party checkout redirect, without also instrumenting the destination page itself.
- **Never let a form silently succeed without persisting the submission somewhere queryable.** `/api/contact` and `/api/newsletter` will produce the same "no data to report" gap every single time until they're wired to Airtable (or equivalent).
- **Never assume analytics credentials with collection access (`NEXT_PUBLIC_GA_ID`) are the same as credentials with query access (Data API service account, Vercel token, Clarity token).** This cost real setup time this campaign and should be provisioned *before* the next campaign launches, not after it ends.
- **Never burn a hard-quota API (Clarity: 10 requests/day) on ad hoc verification testing during the only window it can see.** Verify auth with the cheapest possible call, then run the real pull once.

---

## Immediate Action Items

Ranked by expected impact vs. effort. Effort is rough (S = under an hour, M = a few hours, L = a day or more).

### Critical

| # | Item | Why | Effort |
|---|---|---|---|
| 1 | Add a `Disallow: /black2school/thank-you` (and any future thank-you/confirmation paths) rule to `robots.ts` | Currently fetchable by any crawler/scanner despite being `noindex`; likely contributor to the unexplained thank-you-page sessions | S |
| 2 | Fire a tracking event **on the thank-you page itself** (e.g. `black2school_purchase_confirmed`) instead of relying solely on the pre-checkout click event | This is the actual fix for the click/purchase discrepancy — closes the gap between "clicked toward Square" and "reached the confirmation page" | S |
| 3 | Wire `/api/contact` to Airtable (same `saveIntake()` pattern as campaign-inquiry) | Currently zero durable record of any contact inquiry, ever | M |

### High

| # | Item | Why | Effort |
|---|---|---|---|
| 4 | Establish and apply a UTM parameter standard before any print/QR asset is finalized (see `CAMPAIGN_TRACKING_STANDARDS.md`) | Directly fixes the QR/social attribution gap for the next campaign | S |
| 5 | Investigate and enable bot filtering on Vercel Analytics / GA4 (check Vercel Firewall bot management settings) | 88% of reported traffic this campaign was not real; this inflates every future report until addressed | M |
| 6 | Wire `/api/newsletter` to Airtable or a real provider | Same class of gap as contact — currently un-auditable | M |
| 7 | Mark the real Black2School conversion events (`_form_submit`, `_purchase_fixed` and its replacement) as GA4 Key Events in the property admin | Enables GA4's built-in conversion reporting/attribution rather than treating them as generic events | S |

### Medium

| # | Item | Why | Effort |
|---|---|---|---|
| 8 | Build a dedicated, UTM-tagged short-link/redirect for QR codes instead of a bare URL baked into the image | Makes future QR reprints attribution-correct without regenerating the QR image every time tags change | M |
| 9 | Re-run the Clarity pull specifically within days of the next campaign's traffic, and budget its request quota deliberately (max ~2-3 verification calls, save the rest for the real pull) | Clarity is otherwise permanently unusable retroactively | S |
| 10 | Investigate why `black2school_page_view` didn't fire despite confirmed sessions on the page | Possible tracking gap on page mount, worth a direct check against the live page | S |

### Low

| # | Item | Why | Effort |
|---|---|---|---|
| 11 | Manually review Clarity session recordings by hand once quota/window allows | API can't surface video; this still requires a human in the dashboard | M |
| 12 | Document the actual reset cadence of Clarity's 10-req/day quota (rolling 24h vs. fixed UTC boundary) | Currently unknown/undocumented, would help future quota budgeting | S |
