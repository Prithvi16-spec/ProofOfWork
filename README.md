# ProofOfWork

A responsive portfolio builder for students. It supports email/password authentication, editable profile details, CRUD portfolio entries, optional evidence links, and read-only public profile URLs. An entry is labelled **Evidence-linked** when a supporting URL is attached and **Self-reported** when it is not; the application does not claim that links or claims are verified. The `/sample` route is a clearly labelled fictional demo portfolio.

## Stack

- React + Vite
- Supabase Auth and Postgres (`@supabase/supabase-js`)
- Row Level Security policies for owner-only editing and published public profiles

## Readability update

`src/styles.css` now uses a larger typography scale across the landing page, workspace, forms and public portfolios. The public profile uses larger name, biography, skill, evidence-label and project-description text. Small-screen rules keep the layout responsive while preserving readable text sizes.

If you already have the app running locally, the typography-only update requires just replacing `src/styles.css` with the updated file; no package install or Supabase schema change is needed. Vite should refresh the page automatically; otherwise refresh the browser.

## Run locally

Requirements: Node.js 20+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The supplied Supabase URL and publishable key are configured as client-side defaults in `src/lib/supabase.js`; `.env.local` is optional for this configured project but supported for overrides. Publishable keys are intended for browser usage; never put a Supabase secret or service-role key in frontend code.

## Set up Supabase

1. Open the project's [Supabase SQL Editor](https://supabase.com/dashboard/project/bctporhapokwtixstqwc/sql/new).
2. If the schema has not already been installed, paste the entire contents of `db/schema.sql` and run it. It creates `profiles` and `portfolio_entries`, timestamp triggers, Row Level Security policies, and a trigger that creates a profile after each new Auth user is inserted. If these tables and policies are already working, do not rerun SQL just to update fonts.
3. In **Authentication → URL Configuration**, set the local Site URL to `http://localhost:5173` during development and allow `http://localhost:5173/**` in Redirect URLs. When deploying, set Site URL to your real HTTPS domain and add that domain to Redirect URLs.
4. In **Authentication → Providers → Email**, choose whether email confirmation is required. If enabled, users must confirm their email before signing in.
5. Deploy the Vite app to a static host with SPA fallback enabled so `/u/:slug` routes return `index.html`.

The app deliberately creates new profiles as private (`is_public = false`). The owner can publish from the dashboard. Public routes only read profiles with `is_public = true`. Entries are visible publicly only when their owner's profile is public. All entry writes are scoped to the authenticated owner by RLS.

## Database notes

- `profiles.id` references `auth.users.id`, and `handle_new_user()` provisions the matching profile on signup.
- The profile slug is generated from the user's display name, made URL-safe and suffixed if needed to avoid collisions.
- `portfolio_entries.evidence_url` is nullable and URL-scheme constrained to `http://` or `https://`.
- Do not interpret an attached URL as independent validation. The UI consistently describes these entries as evidence-linked, not verified.

## Main routes

- `/` — marketing page when signed out; private dashboard when signed in
- `/sample` — static, fictional sample portfolio
- `/u/:slug` — read-only public page for a published profile

## Before production

Enable and test email verification/password-reset policy, add rate limiting/bot protection as appropriate, configure the deployed Site URL and Redirect URLs, and review privacy requirements. A public portfolio's profile fields and entries are public by design when published. Keep Row Level Security enabled. The browser publishable key is expected to be visible; never expose a secret or service-role key in frontend code.
