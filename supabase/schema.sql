-- Portfolio database foundation
-- Run this file in the Supabase SQL Editor once for the new project.
--
-- Security model:
--   • Visitors can read only published portfolio content.
--   • Authenticated users can write only when their auth.users id exists
--     in admin_users.
--   • admin_users itself is not publicly readable.
--   • The service/secret key is intentionally not used by the frontend.

create extension if not exists "pgcrypto";

create table if not exists public.admin_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  title text not null,
  category text not null,
  status text not null default 'IN PROGRESS',
  description text not null default '',
  details text not null default '',
  tags text[] not null default '{}',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.experience (
  id uuid primary key default gen_random_uuid(),
  period text not null,
  title text not null,
  organization text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.skill_groups (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  skills text[] not null default '{}',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.certifications (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  issuer text not null,
  description text not null default '',
  type text not null default 'formal',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.learning_areas (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at
before update on public.projects
for each row execute function public.set_updated_at();

drop trigger if exists experience_set_updated_at on public.experience;
create trigger experience_set_updated_at
before update on public.experience
for each row execute function public.set_updated_at();

drop trigger if exists skill_groups_set_updated_at on public.skill_groups;
create trigger skill_groups_set_updated_at
before update on public.skill_groups
for each row execute function public.set_updated_at();

drop trigger if exists certifications_set_updated_at on public.certifications;
create trigger certifications_set_updated_at
before update on public.certifications
for each row execute function public.set_updated_at();

drop trigger if exists learning_areas_set_updated_at on public.learning_areas;
create trigger learning_areas_set_updated_at
before update on public.learning_areas
for each row execute function public.set_updated_at();

alter table public.admin_users enable row level security;
alter table public.projects enable row level security;
alter table public.experience enable row level security;
alter table public.skill_groups enable row level security;
alter table public.certifications enable row level security;
alter table public.learning_areas enable row level security;

revoke all on table
  public.admin_users,
  public.projects,
  public.experience,
  public.skill_groups,
  public.certifications,
  public.learning_areas
from anon, authenticated;

grant select on table
  public.projects,
  public.experience,
  public.skill_groups,
  public.certifications,
  public.learning_areas
to anon, authenticated;

grant select on table public.admin_users to authenticated;

grant insert, update, delete on table
  public.projects,
  public.experience,
  public.skill_groups,
  public.certifications,
  public.learning_areas
to authenticated;

create policy "Public can read published projects"
on public.projects
for select
to anon, authenticated
using (is_published = true);

create policy "Admins can read all projects"
on public.projects
for select
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

create policy "Admins can insert projects"
on public.projects
for insert
to authenticated
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

create policy "Admins can update projects"
on public.projects
for update
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

create policy "Admins can delete projects"
on public.projects
for delete
to authenticated
using (
  exists (
    select 1
    from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

create policy "Public can read published experience"
on public.experience
for select
to anon, authenticated
using (is_published = true);

create policy "Admins can manage experience"
on public.experience
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

create policy "Public can read published skill groups"
on public.skill_groups
for select
to anon, authenticated
using (is_published = true);

create policy "Admins can manage skill groups"
on public.skill_groups
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

create policy "Public can read published certifications"
on public.certifications
for select
to anon, authenticated
using (is_published = true);

create policy "Admins can manage certifications"
on public.certifications
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

create policy "Public can read published learning areas"
on public.learning_areas
for select
to anon, authenticated
using (is_published = true);

create policy "Admins can manage learning areas"
on public.learning_areas
for all
to authenticated
using (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
)
with check (
  exists (
    select 1 from public.admin_users
    where admin_users.user_id = (select auth.uid())
  )
);

create policy "Authenticated users can read their admin record"
on public.admin_users
for select
to authenticated
using ((select auth.uid()) = user_id);
