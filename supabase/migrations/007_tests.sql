-- Tests: courses -> tests -> questions -> options; user test results

-- Enable UUID if not already
create extension if not exists "uuid-ossp";

-- tests table
create table if not exists public.tests (
  id uuid primary key default uuid_generate_v4(),
  course_id uuid not null references public.courses(id) on delete cascade,
  title text not null,
  pass_percent int not null default 60,
  is_published boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- questions
create table if not exists public.test_questions (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid not null references public.tests(id) on delete cascade,
  question text not null,
  order_index int not null default 0,
  created_at timestamptz not null default now()
);

-- options
create table if not exists public.test_options (
  id uuid primary key default uuid_generate_v4(),
  question_id uuid not null references public.test_questions(id) on delete cascade,
  text text not null,
  is_correct boolean not null default false
);

-- results
create table if not exists public.test_results (
  id uuid primary key default uuid_generate_v4(),
  test_id uuid not null references public.tests(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  score int not null,
  total int not null,
  percent int not null,
  passed boolean not null,
  created_at timestamptz not null default now(),
  unique(test_id, user_id, created_at)
);

-- RLS
alter table public.tests enable row level security;
alter table public.test_questions enable row level security;
alter table public.test_options enable row level security;
alter table public.test_results enable row level security;

-- Policies: admins full access (assumes is_admin() exists), others read published tests and own results
-- Helper: admin check based on user_profiles.role = 'admin'
drop function if exists public.is_admin();
create function public.is_admin()
returns boolean
language sql
stable
security definer
as $$
  select exists (
    select 1 from public.user_profiles up
    where up.id = auth.uid() and up.role = 'admin'
  );
$$;

drop policy if exists tests_select_public on public.tests;
create policy tests_select_public on public.tests
  for select using (is_admin() or is_published);
drop policy if exists tests_modify_admin on public.tests;
create policy tests_modify_admin on public.tests
  for all using (is_admin()) with check (is_admin());

drop policy if exists test_questions_select on public.test_questions;
create policy test_questions_select on public.test_questions
  for select using (exists (select 1 from public.tests t where t.id = test_questions.test_id and (is_admin() or t.is_published)));
drop policy if exists test_questions_modify_admin on public.test_questions;
create policy test_questions_modify_admin on public.test_questions
  for all using (is_admin()) with check (is_admin());

drop policy if exists test_options_select on public.test_options;
create policy test_options_select on public.test_options
  for select using (exists (
    select 1 from public.test_questions q
    join public.tests t on t.id = q.test_id
    where q.id = test_options.question_id and (is_admin() or t.is_published)
  ));
drop policy if exists test_options_modify_admin on public.test_options;
create policy test_options_modify_admin on public.test_options
  for all using (is_admin()) with check (is_admin());

drop policy if exists test_results_select on public.test_results;
create policy test_results_select on public.test_results
  for select using (is_admin() or auth.uid() = user_id);
drop policy if exists test_results_insert on public.test_results;
create policy test_results_insert on public.test_results
  for insert with check (auth.uid() = user_id);

-- Update trigger for tests.updated_at
create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists trg_tests_updated_at on public.tests;
create trigger trg_tests_updated_at
before update on public.tests
for each row execute procedure public.set_updated_at();


