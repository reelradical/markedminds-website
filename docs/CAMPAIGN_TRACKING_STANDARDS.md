# Campaign Tracking Standards

Living reference for how every future campaign should be tagged, named, and
instrumented — written after the Black2SchoolMVMT postmortem
(`docs/BLACK2SCHOOL_POSTMORTEM.md`) to close the specific gaps found there.
Apply this **before** a campaign launches, not after.

---

## UTM standards

Every link that leaves the website's own navigation — QR codes, social
posts, email signatures, print material, paid ads — must carry UTM
parameters. No exceptions, including "it's just a temporary post."

**Format:**

```
https://markedminds.com/<campaign-slug>?utm_source=<source>&utm_medium=<medium>&utm_campaign=<campaign>
```

| Parameter | Rule | Examples |
|---|---|---|
| `utm_source` | The specific platform or physical channel | `qr`, `linkedin`, `instagram`, `facebook`, `print`, `email-signature` |
| `utm_medium` | The type of channel | `qr`, `social`, `referral`, `print`, `email` |
| `utm_campaign` | Must exactly match `campaign.analytics.campaign` in `src/lib/data/campaigns.ts` | `black2school-2026` |

Never invent a new `utm_campaign` value at print/post time — pull it from
the campaign's own data file so it matches what GA4's `sessionCampaignName`
dimension will report. A mismatch here silently splits one campaign's
traffic into two unrelated-looking buckets.

## QR code standards

- The QR code must always encode a **UTM-tagged URL**, never a bare domain.
  This was the single biggest gap in the Black2School campaign — the
  printed piece's QR code had no UTM parameters at all, and it is not
  fixable after printing.
- Prefer a dedicated redirect (e.g. `markedminds.com/go/<campaign-slug>`
  server-side redirecting to the fully-tagged URL) over baking the full
  UTM string directly into the QR image. This lets tagging be corrected or
  extended later without reprinting.
- Before finalizing any print asset: generate the QR code, decode it with
  an independent tool, and confirm the decoded URL includes all three UTM
  parameters. Treat "the QR code scans" and "the QR code scans to the
  *correctly tagged* URL" as two separate checks.

## GA4 events

- Every campaign gets its own `${campaign.slug}_*` event namespace,
  matching the existing pattern in `src/components/campaign/*.tsx`
  (`trackEvent()` calls via `src/lib/analytics.ts`).
- At minimum, every campaign page needs: `_page_view`, `_form_start`,
  `_form_submit`, `_offer_click`. Add `_service_select` /
  `_copy_code` / equivalents only if the page has that interaction.
- **A click toward an external checkout is not a conversion event.** If
  the campaign has any external payment/booking flow (Square, Calendly,
  etc.), fire the "intent" event on click (`_purchase_click`, not
  `_purchase_fixed` — see naming conventions below) **and** fire a
  separate, distinct confirmation event on the actual thank-you/success
  page (`_purchase_confirmed`). Relying on the click event alone was the
  root cause of the unexplained purchase-tracking gap in the Black2School
  report.
- In GA4 Admin, mark the real conversion events (form submit, purchase
  confirmed) as **Key Events** for the property. This is a one-time
  per-event-name admin action, not something the codebase can set.

## Square purchase events

- Every Square Payment Link used in a campaign must have its redirect URL
  set to the campaign's thank-you page (already the pattern for
  Black2School — verify this is still true for every link before launch,
  not just at initial setup).
- The thank-you page itself must fire a confirmation tracking event on
  mount. Do not rely solely on the originating page's click event —
  `target="_blank"` checkout flows can and do produce sessions where GA4
  attributes the thank-you page as its own session's landing page, not a
  continuation of the click.
- If Square ever offers a webhook for completed payments, prefer that as
  the source of truth over any client-side event — client-side firing can
  always be blocked by an ad blocker or missed by a closed tab; a webhook
  cannot.

## Custom conversions

- A "conversion" for reporting purposes must be either (a) a GA4 Key
  Event, or (b) a durable, queryable record (Airtable Intake Queue is the
  standard here). A `console.log()` in an API route is not a conversion
  source and will not show up in any future report — see `/api/contact`
  and `/api/newsletter` in the Black2School postmortem for exactly this
  failure mode.
- Before launch, confirm every form on the campaign is wired to at least
  one of the two above. If a form is genuinely not meant to be tracked,
  document that explicitly rather than leaving it ambiguous.

## Event naming conventions

```
<campaign-slug>_<action>
```

- `campaign-slug` matches `campaigns.<key>.slug` exactly (kebab-case, no
  year suffix — the year lives in `analytics.campaign`, not the slug).
- `action` is a short, present-tense-neutral verb phrase: `page_view`,
  `form_start`, `form_submit`, `offer_click`, `service_select`,
  `copy_code`, `purchase_click`, `purchase_confirmed`.
- Never reuse an action name with a different meaning across campaigns —
  if `black2school_purchase_fixed` means "clicked toward checkout," a
  future campaign's `_purchase_fixed` must mean the same thing, or it
  should be renamed.

## Campaign naming conventions

- `campaign.slug`: kebab-case, short, matches the URL path
  (`/black2school` → `black2school`).
- `campaign.analytics.campaign`: `<slug>-<year>` (`black2school-2026`).
  This is the value that goes in every `utm_campaign` parameter for that
  campaign, and the value GA4's `sessionCampaignName` will report — the
  two must always match exactly.
- `campaign.analytics.source`: a short label for where the campaign
  originates (`black2school-conference`), used as a fallback / internal
  label, not a UTM value itself.

## Source attribution

- Direct/QR/social attribution is only as good as the UTM tagging above —
  budget for the fact that some traffic will always land in
  `(direct)/(none)` and treat that bucket as "unattributed," not "organic
  direct," when a QR code or social push was active.
- Cross-reference GA4's `sessionSource`/`sessionMedium` against Vercel's
  `referrerHostname` for the same window — they measure slightly
  different things (GA4 session-scoped source vs. Vercel's raw HTTP
  referrer) and agreement between them is a good sanity check;
  disagreement is worth investigating before trusting either number.

## Internal testing checklist

Before external launch, from a real device (not just a local dev server):

- [ ] Submit every form with real-looking data and confirm the GA4 event,
      Airtable record, and any email all arrive.
- [ ] Click every external link (Square, social) and confirm the "intent"
      GA4 event fires.
- [ ] Complete a real end-to-end purchase (if applicable) and confirm the
      thank-you-page confirmation event fires, separate from the click
      event.
- [ ] Scan the actual printed/final QR code (not a draft) and confirm the
      decoded URL has correct UTM parameters.
- [ ] Load the campaign page and thank-you page and confirm `noindex` is
      present but the page still renders/shares correctly (check the
      actual `<meta name="robots">` output, not just the Next.js metadata
      object).

## Bot filtering

- The Black2School report found ~88% of GA4-reported users and a
  systematic Vercel crawl pattern that were not real visitors. Before the
  next campaign: check Vercel's Firewall / bot-management settings and
  GA4's built-in bot-filtering setting (Admin → Data Settings → Data
  Filters) and confirm both are active.
- Treat any campaign report's sitewide totals as unreliable until bot
  filtering is confirmed on — page-specific numbers (e.g. sessions on the
  actual campaign URL) are more trustworthy in the meantime, but still not
  bot-proof on their own.

## Spam monitoring

- Every public form must have the honeypot + timing guard
  (`src/lib/spam-guard.ts`, `src/components/shared/honeypot-field.tsx`) —
  this is now the standard for all five existing public forms; any new
  form added for a future campaign must include it from day one, not
  retrofitted after spam shows up.
- Maintain the "known spam record ID" exclusion pattern
  (`scripts/conference-analytics-report.mjs`) for any records confirmed
  as bot submissions before a report is generated — do not silently drop
  spam without recording which record IDs were excluded and why.
