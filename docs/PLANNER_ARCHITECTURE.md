# Marked Minds Planner — Phase 1A Architecture

Phase 1A establishes a visual and routing boundary only. It does not include
authentication, onboarding, a database, AI calls, billing, plan generation, or
plan persistence.

## Route boundaries

- `markedminds.com/plan` is the public, indexable product landing page.
- `/planner` is the internal application route and remains directly available
  during local development.
- `app.markedminds.com` is the intended production application hostname.

Public site pages live in `src/app/(marketing)`. The route-group name does not
appear in URLs, so existing public routes remain unchanged. The application
shell lives in `src/app/(planner)/planner` and receives a separate layout.

The root layout owns only document-wide concerns: HTML/body, fonts, global
styles, the metadata base and icons, and the universal skip link.

## Analytics and privacy boundary

The marketing layout owns all existing analytics integrations:

- Google Analytics 4 loads only on marketing routes when configured.
- Microsoft Clarity loads only on marketing routes when configured.
- Vercel Web Analytics is also scoped to marketing routes in Phase 1A.

The Planner layout renders none of these integrations. In particular, Clarity
session replay cannot load from the Planner component tree. No Planner-specific
analytics or event collection is implemented in this phase.

## Prepared subdomain routing

`src/proxy.ts` recognizes only the exact production hostname
`app.markedminds.com`. Requests on that hostname are internally rewritten to
the `/planner` route tree. Requests on localhost, preview deployments, and the
main marketing hostname pass through unchanged, so `/planner` continues to
work directly during development.

Before activating the subdomain in production:

1. Add `app.markedminds.com` to the existing Vercel project.
2. Add the CNAME record Vercel specifies at the current DNS provider.
3. Wait for Vercel domain verification and SSL provisioning.
4. Test the root URL and future nested application routes on the real hostname.
5. Decide canonical/redirect behavior for direct production visits to
   `markedminds.com/planner`; Phase 1A intentionally does not force a redirect.

No DNS or Vercel project setting is changed by the repository code alone.

## Next implementation boundary

The next phase should make explicit decisions about authentication, account and
organization ownership, data privacy, persistence, and the AI provider service
before adding the Account → onboarding → Plan Tomorrow vertical slice.
