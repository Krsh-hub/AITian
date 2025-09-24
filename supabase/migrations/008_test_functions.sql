-- Secure grading function: takes answers and returns score without exposing correct answers
-- answers jsonb expected shape: [{"question_id": "...", "option_id": "..."}, ...]

create or replace function public.grade_test(p_test_id uuid, p_answers jsonb, p_user_id uuid)
returns table(score int, total int, percent int, passed boolean)
language plpgsql
security definer
as $$
declare
  correct_count int;
  total_count int;
  pass_threshold int;
begin
  -- total questions
  select count(*) into total_count from public.test_questions q where q.test_id = p_test_id;

  -- count matches where selected option is correct
  select count(*) into correct_count
  from jsonb_to_recordset(p_answers) as a(question_id uuid, option_id uuid)
  join public.test_options o on o.question_id = a.question_id and o.id = a.option_id and o.is_correct = true
  join public.test_questions q on q.id = o.question_id and q.test_id = p_test_id;

  if total_count = 0 then
    score := 0; total := 0; percent := 0; passed := false; return next; return;
  end if;

  -- pass percent from test
  select t.pass_percent into pass_threshold from public.tests t where t.id = p_test_id;

  score := correct_count;
  total := total_count;
  percent := round((score::numeric * 100) / total)::int;
  passed := percent >= coalesce(pass_threshold, 60);

  -- store result
  insert into public.test_results(test_id, user_id, score, total, percent, passed)
  values (p_test_id, p_user_id, score, total, percent, passed);

  return next;
end;
$$;

grant execute on function public.grade_test(uuid, jsonb, uuid) to authenticated;


