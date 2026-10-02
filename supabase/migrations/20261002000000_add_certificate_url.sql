-- Add an optional URL for a certificate document or verification page.
alter table public.certifications
  add column if not exists certificate_url text;

comment on column public.certifications.certificate_url is
  'Optional public URL for viewing the certificate or credential verification page.';
