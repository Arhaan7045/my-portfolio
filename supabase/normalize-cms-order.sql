-- One-time CMS ordering cleanup.
-- Run this in Supabase SQL Editor after the CMS tables contain your current data.
-- It converts legacy/zero-based or gapped sort_order values into 1..N.
--
-- Safe to re-run: it only rewrites the ordering numbers, not content.

with ranked as (
  select id, row_number() over (order by sort_order asc, created_at asc, id asc) as new_order
  from public.projects
)
update public.projects as p
set sort_order = ranked.new_order
from ranked
where p.id = ranked.id;

with ranked as (
  select id, row_number() over (order by sort_order asc, created_at asc, id asc) as new_order
  from public.experience
)
update public.experience as e
set sort_order = ranked.new_order
from ranked
where e.id = ranked.id;

with ranked as (
  select id, row_number() over (order by sort_order asc, created_at asc, id asc) as new_order
  from public.skill_groups
)
update public.skill_groups as s
set sort_order = ranked.new_order
from ranked
where s.id = ranked.id;

with ranked as (
  select id, row_number() over (order by sort_order asc, created_at asc, id asc) as new_order
  from public.learning_areas
)
update public.learning_areas as l
set sort_order = ranked.new_order
from ranked
where l.id = ranked.id;

with ranked as (
  select id, row_number() over (order by sort_order asc, created_at asc, id asc) as new_order
  from public.certifications
)
update public.certifications as c
set sort_order = ranked.new_order
from ranked
where c.id = ranked.id;
