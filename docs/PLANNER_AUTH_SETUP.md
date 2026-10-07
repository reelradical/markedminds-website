# Marked Minds Planner — Phase 1C Authentication Setup

**Status:** Authentication proof of concept
**Provider:** Supabase Auth
**Sign-in method:** Google OAuth
**Application data schema:** Not created in this phase

Phase 1C proves the narrow path:

> Account → authenticate → server recognizes user → protected Planner

It does not create profiles, onboarding, plans, migrations, RLS policies, AI
services, organizations, billing, or password storage.

## Repository contract

The integration pins these packages because Supabase currently describes its
SSR package as beta:

```json
"@supabase/ssr": "0.12.7",
"@supabase/supabase-js": "2.117.2"
```

This pinned `supabase-js` release requires Node.js 22 or newer. Confirm the
Vercel project runtime is Node.js 22+ before deployment; local validation used
Node.js 26.

Install them with the repository lockfile:

```bash
npm install
```

The client boundary is centralized:

- `src/lib/supabase/client.ts` creates the browser client used to start OAuth.
- `src/lib/supabase/server.ts` creates cookie-aware clients for Server
  Components and Route Handlers.
- `src/lib/supabase/proxy.ts` refreshes sessions for Planner/auth requests.
- `src/lib/supabase/auth.ts` performs the authoritative server-side user lookup.

Do not create ad hoc Supabase clients in pages or components.

## 1. Create the Supabase project

1. Create one Supabase project for the Planner proof of concept.
2. In **Project Settings → API**, copy the project URL and publishable key.
3. Do not copy or use the service-role key. Phase 1C does not need it.
4. Keep production and local values out of source control.

Add the values to `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY
```

These two values are designed for browser use. Authorization must never depend
on their secrecy. Never place a service-role key or another privileged secret
in a `NEXT_PUBLIC_` variable.

Add the same variables in Vercel under **Project Settings → Environment
Variables** for each deployment environment where Planner auth should work.

When either value is missing or the URL is invalid, `/login` renders a safe
configuration message and `/planner` redirects there. It does not pretend that
authentication succeeded.

## 2. Configure Google OAuth

In the Google Cloud console:

1. Create or select an OAuth consent screen and Web application OAuth client.
2. In Supabase, open **Authentication → Providers → Google** and copy the
   callback URL shown there. It has the form:
   `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`.
3. Add that exact Supabase URL to the Google client's **Authorized redirect
   URIs**.
4. Copy the Google client ID and client secret into the Supabase Google provider
   configuration, then enable the provider.

The Google redirect URI is the Supabase callback, not the application callback.
Supabase completes the provider exchange and then returns the browser to this
application.

## 3. Configure Supabase redirect URLs

In **Supabase → Authentication → URL Configuration**:

- Set an appropriate Site URL for the environment.
- Add these development and production redirect URLs to the allow list:

```text
http://localhost:3000/auth/callback
https://maps.markedminds.com/auth/callback
```

The current Google sign-in button also appends a validated local `next` path.
Supabase matches the full redirect URL, including its query string, so add the
two exact OAuth redirect variants as well:

```text
http://localhost:3000/auth/callback?next=%2Fplanner
https://maps.markedminds.com/auth/callback?next=%2F
```

Without those query-bearing entries, Supabase falls back to the Site URL after
Google authentication instead of returning to the requested environment.

For Vercel previews, add only the specific approved preview callback pattern
needed by the team. Avoid an unrestricted wildcard in production.

The application validates the `next` query parameter as a local path before a
post-auth redirect. Absolute, protocol-relative, backslash, and control-character
destinations are rejected.

## 4. Domain and cookie behavior

`maps.markedminds.com` must point to the existing Vercel project as described in
`docs/PLANNER_ARCHITECTURE.md`. The proxy maps clean application URLs to the
internal `/planner` route tree while leaving auth endpoints unchanged:

| Development/main-domain URL | Planner-subdomain URL |
|---|---|
| `/planner` | `/` |
| `/login` | `/login` |
| `/auth/callback` | `/auth/callback` |
| `/logout` | `/logout` |

Supabase SSR stores the session in HTTP cookies and refreshes it through the
repository proxy. The protected Server Component still calls Supabase to verify
the current user; the proxy is an optimistic refresh layer, not authorization.

## 5. Verification checklist

Run:

```bash
npm run lint
npx tsc --noEmit
npm run build
npm run dev
```

Then verify:

1. `/plan` and existing marketing routes still render normally.
2. `/login` renders without marketing analytics scripts.
3. An unauthenticated visit to `/planner` redirects to `/login`.
4. Google sign-in returns through `/auth/callback` and opens the Planner.
5. The Planner shows the authenticated account name or email from a server
   render.
6. A private/incognito browser cannot open `/planner` without signing in.
7. **Sign out** clears the local Supabase session and returns to `/login`.
8. On the configured subdomain, `/` is protected and the clean callback works.
9. GA4, Clarity, and Vercel Analytics remain absent from Planner/auth pages.

Items 4–8 require a configured Supabase project, Google credentials, and (for
the subdomain check) deployed DNS. They cannot be proven by a repository-only
build.

## Failure behavior

- Missing configuration: show the safe login configuration state.
- OAuth start failure: keep the user on `/login` with a retryable message.
- Missing or invalid callback code: return to `/login` with a generic error.
- Invalid/expired session: treat the request as unauthenticated.
- Sign-out failure: keep the protected page available and show a retry message.
- Supabase/proxy refresh failure: the server-side user check remains the final
  gate; marketing routes are unaffected.

Errors must not include provider payloads, tokens, cookies, keys, or user
claims in the UI or logs.

## Explicit deferrals

Email magic-link/OTP sign-in is the immediate fallback to add if Google is not
available for a teacher. It is intentionally deferred because the PKCE email
template and `/auth/confirm` token-hash path should be configured and tested as
one separate slice.

Also deferred: profile synchronization, application database tables,
migrations, RLS, onboarding, Plan Tomorrow, saved plans, AI services, billing,
organizations, account deletion, and production legal/compliance review.
