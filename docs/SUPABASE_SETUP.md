# Supabase foundation setup

This project now contains the Supabase client foundation and the database schema for the portfolio.

## 1. Create the Supabase project

Create a new project from the Supabase Dashboard.

Do not add portfolio data yet. The current TypeScript data source remains the source of truth until the admin workflow is ready.

## 2. Add the database schema

Open the Supabase SQL Editor and run:

`supabase/schema.sql`

This creates:

- `projects`
- `experience`
- `skill_groups`
- `certifications`
- `learning_areas`
- `admin_users`

RLS is enabled for every table.

Public visitors can read published portfolio content. Write access is reserved for authenticated users whose id is present in `admin_users`.

## 3. Add local environment variables

Copy `.env.example` to `.env.local` and fill in:

```text
NEXT_PUBLIC_SUPABASE_URL=your-project-url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Never put a Supabase secret/service-role key in the browser or commit it to Git.

## 4. Install the new dependencies

From the project folder:

```bash
npm install
```

The branch adds:

- `@supabase/ssr`
- `@supabase/supabase-js`

## 5. Do not migrate the portfolio data yet

The public site still reads from `src/data/portfolio.ts`.

The next backend batch will introduce authentication and then connect the admin workflow. After that, the public pages can be moved to database-backed content without making the current site dependent on an unfinished admin system.
