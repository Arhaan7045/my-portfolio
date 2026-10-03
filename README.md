# My Portfolio

Personal cybersecurity portfolio built with Next.js, React, TypeScript, and Supabase.

The site showcases projects, practical experience, skills, certifications, and learning areas. Portfolio content is managed through a protected admin area.

## Tech stack

- Next.js App Router
- React and TypeScript
- Supabase Auth and Postgres with Row Level Security
- ESLint

## Requirements

- Node.js 22 (Node.js 20.9+ is required by the current Next.js version; Node 22 is used in CI)
- npm
- A Supabase project

## Local development

1. Clone the repository and install dependencies:

   ```bash
   npm ci
   ```

2. Create a local environment file:

   ```bash
   cp .env.example .env.local
   ```

3. Fill in the Supabase project URL and publishable key in `.env.local`.
4. In the Supabase SQL Editor, run `supabase/schema.sql`.
5. Create or invite your admin account in Supabase Authentication, then add that user's UUID to `public.admin_users`. Do this only for accounts that should manage the portfolio.
6. Start the development server:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Validation

Run these checks before deploying:

```bash
npm ci
npm run lint
npm run typecheck
npm run build
```

GitHub Actions runs the same checks on pushes to `main`, pull requests targeting `main`, and manual workflow dispatches.

## Production deployment

This project can be deployed to a Node.js-compatible Next.js host such as Vercel.

1. Import this GitHub repository into your hosting provider.
2. Set the production environment variables listed below in the host's project settings.
3. Ensure `supabase/schema.sql` has been applied to the production Supabase project.
4. Add only the intended administrator's Supabase Auth user UUID to `public.admin_users`.
5. Deploy and wait for the provider's build to finish successfully.
6. Smoke-test the public home page, a published project case study, admin login, an admin-only page, sign-out, and unknown URLs.
7. Verify that a non-admin account cannot access `/admin` or write content, and that unpublished content is not visible publicly.
8. Re-test authentication and content updates after changing Supabase policies or environment variables.

### Environment variables

Set these in the deployment provider and keep the values out of Git:

| Variable | Required | Purpose |
| --- | --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` | Yes | Supabase publishable key for client/server session access |

Only use the Supabase publishable key in this app. Never add a Supabase service-role/secret key to a `NEXT_PUBLIC_*` variable or commit secrets to the repository.

The `.env*` pattern is ignored by Git. `.env.example` documents the required variable names without containing credentials.

## Security notes

- Admin pages verify the authenticated session and the `public.admin_users` allowlist on the server.
- Server actions must verify admin access before performing writes.
- Supabase Row Level Security policies are part of the access-control boundary; apply and verify them in the production project.
- A hidden or unlinked admin URL is not an access-control mechanism. Access must remain enforced by server-side checks and database policies.

## Project structure

```text
src/
├── app/          # App Router pages and routes
├── components/   # UI components
├── data/         # Portfolio content and static data
└── lib/           # Supabase clients and server-side helpers
supabase/
└── schema.sql    # Database tables, grants, and RLS policies
.github/
└── workflows/
    └── ci.yml    # Lint, TypeScript, and production build checks
```
