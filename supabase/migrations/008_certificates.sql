-- Certificates: course completion certificates with PDF storage
-- Enable UUID if not already
create extension if not exists "uuid-ossp";

-- certificates table
create table if not exists public.certificates (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references auth.users(id) on delete cascade,
  course_id uuid not null references public.courses(id) on delete cascade,
  issued_on timestamptz not null default now(),
  pdf_url text not null,
  created_at timestamptz not null default now(),
  unique(user_id, course_id)
);

-- RLS
alter table public.certificates enable row level security;

-- Policies: users can only see their own certificates, admins can see all
drop policy if exists certificates_select_own on public.certificates;
create policy certificates_select_own on public.certificates
  for select using (auth.uid() = user_id);

drop policy if exists certificates_select_admin on public.certificates;
create policy certificates_select_admin on public.certificates
  for select using (is_admin());

drop policy if exists certificates_insert_admin on public.certificates;
create policy certificates_insert_admin on public.certificates
  for insert with check (is_admin());

-- Indexes for better performance
create index idx_certificates_user_id on public.certificates(user_id);
create index idx_certificates_course_id on public.certificates(course_id);
create index idx_certificates_issued_on on public.certificates(issued_on);
