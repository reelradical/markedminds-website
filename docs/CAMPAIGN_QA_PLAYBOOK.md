# Campaign QA Playbook

Run this checklist before **every** campaign goes live — print handout,
email push, social launch, or paid ad. Written after the Black2SchoolMVMT
postmortem (`docs/BLACK2SCHOOL_POSTMORTEM.md`); every item here maps to a
real gap found in that campaign, not a hypothetical one.

Do this from a real device on the live (or preview) deployment, not just a
local dev server — several of these gaps (UTM tagging, redirect targets,
noindex output) only show up against the real deployed environment.

---

## Every form

- [ ] Submit with real-looking data — confirm it reaches every destination
      it's supposed to (email, Airtable, or both).
- [ ] Submit with the honeypot field filled (simulating a bot) — confirm
      it silently no-ops (`{ok:true}` response, but **no** email sent, **no**
      Airtable record created).
- [ ] Submit faster than the timing threshold — confirm it's also silently
      rejected.
- [ ] Confirm every required field is actually validated server-side, not
      just client-side (`curl` the API route directly with missing fields).
- [ ] If the form doesn't persist anywhere durable (Airtable or
      equivalent), that's a QA failure, not an acceptable gap — see
      `/api/contact` and `/api/newsletter` in the postmortem for what this
      looks like when missed.

## Every email

- [ ] Trigger every template this campaign can send (internal
      notification + customer confirmation) and read the actual received
      email, not just the rendered preview.
- [ ] Confirm the reply-to address is correct.
- [ ] Confirm links inside the email point to production URLs, not
      `localhost` or a preview deployment.
- [ ] Check spam-folder placement if possible — a new sending pattern can
      trip spam filters even with valid DKIM/SPF.

## Every Airtable record

- [ ] Confirm the record lands in the correct table with every expected
      field populated (not just `Email` — check `Intake Source`,
      `Business Unit`, `Inquiry Type`, `Next Action`, `Next Action Due`).
- [ ] Confirm the duplicate-submission guard actually prevents a
      double-record on an immediate resubmit.
- [ ] Confirm `Intake Status` starts at the expected value (`New`) so
      downstream automations trigger correctly.

## Every Task

- [ ] Confirm the Airtable "New Inquiry" automation actually creates a
      linked Task record (check the Tasks table directly after a real test
      submission — the automation's trigger condition isn't visible via
      API, only its downstream effect is).
- [ ] Confirm the API token being used for reporting/testing actually has
      read access to the Tasks table — if not, note it (this was a known,
      accepted limitation for the Black2School campaign; don't rediscover
      it mid-crisis next time).

## Every event

- [ ] Fire every `trackEvent()` call on the page by hand (page load, form
      start, form submit, every CTA/click) and confirm each one appears in
      GA4 Realtime within a minute.
- [ ] Confirm event names match `docs/CAMPAIGN_TRACKING_STANDARDS.md`'s
      naming convention exactly — a typo here silently creates a new,
      never-reported event name instead of erroring.
- [ ] If a click leads to an external checkout/booking flow, confirm
      there's a **separate** event on the destination/thank-you page, not
      just the originating click.

## Every conversion

- [ ] Confirm each event meant to represent a real conversion is marked as
      a GA4 Key Event in the property admin.
- [ ] Confirm each conversion also has a durable non-GA4 record (Airtable)
      where possible — GA4 alone should never be the only record of a real
      business event.
- [ ] Cross-check: does the conversion count from GA4 roughly match the
      Airtable record count for the same window? A large mismatch is worth
      investigating before launch, not after.

## Every thank-you page

- [ ] Confirm `robots: { index: false, follow: true }` (or equivalent) is
      set.
- [ ] Confirm `robots.ts` has a `Disallow` rule for the thank-you path —
      `noindex` alone does not stop crawlers/scanners from fetching it.
- [ ] Confirm the page fires its own conversion-confirmation event on
      mount — do not rely on an upstream click event alone.
- [ ] Confirm the actual payment/booking provider's redirect URL is set
      correctly for **every** linked product/service, not just the first
      one tested.

## Every QR code

- [ ] Decode the **final, print-ready** QR code (not a draft) with an
      independent scanner/decoder and confirm the exact destination URL.
- [ ] Confirm that URL includes all three UTM parameters
      (`utm_source`, `utm_medium`, `utm_campaign`) per
      `docs/CAMPAIGN_TRACKING_STANDARDS.md`.
- [ ] Confirm the destination URL is the live production domain, not a
      preview/staging deployment.
- [ ] Load the destination URL on both WiFi and cellular data to rule out
      any network-specific blocking (see the SSL/content-filter
      investigation in this campaign — worth a spot-check on a
      school-network connection specifically, given the audience).

## Every CTA

- [ ] Click every button/link on the page and confirm it goes where the
      copy says it goes.
- [ ] Confirm CTA copy and destination stay consistent if the offer/price
      changes after initial build (a stale CTA pointing at an outdated
      offer was a real issue caught earlier in this project's history —
      don't let it recur).
- [ ] Confirm every CTA that should fire a tracking event actually does.

## Every automation

- [ ] Re-verify the Airtable "New Inquiry" automation is still enabled and
      pointed at the correct table/view — automation config isn't visible
      via API, so this has to be checked manually in the Airtable UI each
      campaign, not assumed unchanged.
- [ ] Re-verify spam-guard (`src/lib/spam-guard.ts`) is present on every
      *new* public form added for this campaign, not just the five it was
      originally applied to.
- [ ] Re-verify the deployment succeeded (`gh api
      repos/<org>/<repo>/commits/<sha>/status`) after the final pre-launch
      push — don't assume a push succeeded without checking.
