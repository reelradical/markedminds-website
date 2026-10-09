# Marked Minds Planner — Architecture

Phase 1A established the visual, routing, and analytics boundary. Phase 1C added
Supabase authentication. Phase 1D adds only a minimal authenticated profile and
onboarding layer. It does not include AI calls, billing, plan generation, plan
revisions, or plan persistence.

## Route boundaries

- `markedminds.com/plan` is the public, indexable product landing page.
- `/planner` is the internal application route and remains directly available
  during local development.
- `maps.markedminds.com` is the intended production application hostname.

Public site pages live in `src/app/(marketing)`. The route-group name does not
appear in URLs, so existing public routes remain unchanged. The application
shell lives in `src/app/(planner)/planner` and receives a separate layout.
Public authentication endpoints live in the same `(planner)` route group at
`/login`, `/auth/callback`, and `/logout`. Authenticated profile routes live at
`/onboarding` and `/settings/profile`; the latter shares the MAPS application
shell.

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
`maps.markedminds.com`. Requests on that hostname are internally rewritten to
the `/planner` route tree. Authentication and profile endpoints are excluded
from that rewrite so `/login`, `/auth/callback`, `/logout`, `/onboarding`, and
`/settings/profile` remain stable on every host. Requests on localhost, preview
deployments, and the main marketing hostname pass through unchanged, so
`/planner` continues to work directly during development.

## Authentication boundary

- `src/lib/supabase/client.ts` is the sole browser-client factory.
- `src/lib/supabase/server.ts` is the sole Server Component and Route Handler
  client factory.
- `src/lib/supabase/proxy.ts` refreshes cookie-backed sessions before Planner
  rendering. It is not the authorization boundary.
- The `/planner` Server Component verifies the user with Supabase before it
  renders account or application content.
- `src/server/dal/profiles.ts` is the server-only boundary for profile reads and
  writes. It derives ownership from the verified Supabase user and does not
  accept a client-supplied user ID.
- Incomplete authenticated accounts are redirected from `/planner` to
  `/onboarding`. Completed accounts can edit their saved defaults at
  `/settings/profile`.
- The schema and ownership policies are defined in
  `supabase/migrations/202610090001_maps_teacher_profiles.sql`; setup and
  verification are documented in `docs/PLANNER_PROFILE_SETUP.md`.
- Only the Supabase URL and publishable key are exposed to the browser. There
  is no service-role credential in this phase.
- Planner routes remain outside the marketing layout, so existing GA4,
  Clarity, and Vercel Analytics scripts do not load there.

Before activating the subdomain in production:

1. Add `maps.markedminds.com` to the existing Vercel project.
2. Add the CNAME record Vercel specifies at the current DNS provider.
3. Wait for Vercel domain verification and SSL provisioning.
4. Test the root URL and future nested application routes on the real hostname.
5. Decide canonical/redirect behavior for direct production visits to
   `markedminds.com/planner`; Phase 1A intentionally does not force a redirect.

No DNS or Vercel project setting is changed by the repository code alone.

## Next implementation boundary

After the Phase 1D migration and two-account RLS verification are complete in a
target Supabase environment, the next approved slice may implement one narrow
planning workflow against the approved Phase 1B contracts. AI integration,
saved plans, revisions, billing, organizations, and broader product features
remain separate implementation decisions.
