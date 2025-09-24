import { supabase } from "@/integrations/supabase/client";

export interface TestSummary {
  id: string;
  course_id: string;
  title: string;
  pass_percent: number;
  is_published: boolean;
}

export interface TestQuestionDto {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  // is_correct intentionally omitted on client fetch
}

export interface SubmitResultInput {
  testId: string;
  userId: string;
  score: number;
  total: number;
  percent: number;
  passed: boolean;
}

export const testService = {
  async getPublishedTests(): Promise<TestSummary[]> {
    const { data, error } = await supabase
      .from('tests')
      .select('id, course_id, title, pass_percent, is_published')
      .eq('is_published', true)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },
  async getTestsForCourse(courseId: string): Promise<TestSummary[]> {
    const { data, error } = await supabase
      .from('tests')
      .select('id, course_id, title, pass_percent, is_published')
      .eq('course_id', courseId)
      .order('created_at', { ascending: false });
    if (error) throw new Error(error.message);
    return data ?? [];
  },

  async getPublishedTestQuestions(testId: string): Promise<TestQuestionDto[]> {
    const { data: questions, error } = await supabase
      .from('test_questions')
      .select('id, question, order_index')
      .eq('test_id', testId)
      .order('order_index', { ascending: true });
    if (error) throw new Error(error.message);

    const qIds = (questions ?? []).map((q) => q.id);
    if (qIds.length === 0) return [];

    const { data: options, error: optErr } = await supabase
      .from('test_options')
      .select('id, question_id, text')
      .in('question_id', qIds);
    if (optErr) throw new Error(optErr.message);

    const optionsByQ = new Map<string, { id: string; text: string }[]>();
    (options ?? []).forEach((o) => {
      const arr = optionsByQ.get(o.question_id) ?? [];
      arr.push({ id: o.id, text: o.text });
      optionsByQ.set(o.question_id, arr);
    });

    return (questions ?? []).map((q) => ({
      id: q.id,
      question: q.question,
      options: optionsByQ.get(q.id) ?? [],
    }));
  },

  async gradeAndStore(testId: string, answers: { question_id: string; option_id: string }[]) {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { data, error } = await supabase
      .rpc('grade_test', { p_test_id: testId, p_answers: answers as any, p_user_id: user.id });
    if (error) throw new Error(error.message);
    // data is an array with one row: { score, total, percent, passed }
    return Array.isArray(data) && data.length ? data[0] as { score: number; total: number; percent: number; passed: boolean } : { score: 0, total: 0, percent: 0, passed: false };
  },
};


