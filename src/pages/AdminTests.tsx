import { useEffect, useMemo, useState } from 'react';
import { useCourses } from '@/hooks/use-courses';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import RequireAdmin from '@/components/RequireAdmin';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type EditableQuestion = {
  id?: string;
  question: string;
  options: { id?: string; text: string; is_correct: boolean }[];
};

export default function AdminTests() {
  const { data: courses } = useCourses();
  const [selectedCourseId, setSelectedCourseId] = useState<string>('');
  const [testId, setTestId] = useState<string>('');
  const [title, setTitle] = useState('');
  const [passPercent, setPassPercent] = useState<number>(60);
  const [published, setPublished] = useState<boolean>(false);
  const [questions, setQuestions] = useState<EditableQuestion[]>([]);

  useEffect(() => {
    const load = async () => {
      if (!selectedCourseId) return;
      const { data: tests, error } = await supabase
        .from('tests')
        .select('*')
        .eq('course_id', selectedCourseId)
        .order('created_at', { ascending: false });
      if (error) { toast.error(error.message); return; }
      const t = tests?.[0];
      if (!t) { setTestId(''); setTitle(''); setPassPercent(60); setPublished(false); setQuestions([]); return; }
      setTestId(t.id); setTitle(t.title); setPassPercent(t.pass_percent); setPublished(t.is_published);
      const { data: qs, error: qErr } = await supabase
        .from('test_questions')
        .select('id, question, order_index')
        .eq('test_id', t.id)
        .order('order_index', { ascending: true });
      if (qErr) { toast.error(qErr.message); return; }
      const qIds = (qs ?? []).map(q => q.id);
      const { data: ops } = await supabase
        .from('test_options')
        .select('id, question_id, text, is_correct')
        .in('question_id', qIds);
      const byQ = new Map<string, any[]>();
      (ops ?? []).forEach(o => {
        const arr = byQ.get(o.question_id) ?? []; arr.push(o); byQ.set(o.question_id, arr);
      });
      setQuestions((qs ?? []).map(q => ({ id: q.id, question: q.question, options: (byQ.get(q.id) ?? []).map(o => ({ id: o.id, text: o.text, is_correct: o.is_correct })) })));
    };
    load();
  }, [selectedCourseId]);

  const addQuestion = () => setQuestions(prev => [...prev, { question: '', options: [
    { text: '', is_correct: true }, { text: '', is_correct: false }
  ]}]);

  const save = async () => {
    if (!selectedCourseId) { toast.error('Select course'); return; }
    let id = testId;
    if (!id) {
      const { data, error } = await supabase.from('tests').insert({ course_id: selectedCourseId, title: title || 'Course Test', pass_percent: passPercent, is_published: published }).select('id').single();
      if (error) { toast.error(error.message); return; }
      id = data.id; setTestId(id);
    } else {
      const { error } = await supabase.from('tests').update({ title: title || 'Course Test', pass_percent: passPercent, is_published: published }).eq('id', id);
      if (error) { toast.error(error.message); return; }
    }

    // Upsert questions and options (simple replace for now)
    await supabase.from('test_questions').delete().eq('test_id', id);
    const qRows: { id?: string; test_id: string; question: string; order_index: number }[] = questions.map((q, i) => ({ test_id: id!, question: q.question, order_index: i }));
    const { data: newQs, error: qErr } = await supabase.from('test_questions').insert(qRows).select('id').order('order_index');
    if (qErr) { toast.error(qErr.message); return; }
    const optionRows: any[] = [];
    (newQs ?? []).forEach((q, i) => {
      const opts = questions[i].options;
      opts.forEach(o => optionRows.push({ question_id: q.id, text: o.text, is_correct: o.is_correct }));
    });
    const { error: oErr } = await supabase.from('test_options').insert(optionRows);
    if (oErr) { toast.error(oErr.message); return; }
    toast.success('Saved test');
  };

  return (
    <RequireAdmin>
      <div className="max-w-5xl mx-auto p-6 space-y-6">
        <div className="flex flex-col sm:flex-row gap-3 sm:items-end sm:justify-between">
          <div className="space-y-2">
            <Label>Select course</Label>
            <select className="border rounded px-3 py-2" value={selectedCourseId} onChange={(e) => setSelectedCourseId(e.target.value)}>
              <option value="">-- choose --</option>
              {(courses ?? []).map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
            </select>
          </div>
          <div className="space-y-2 w-full sm:w-auto">
            <Label>Test Title</Label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Course Test" />
          </div>
          <div className="space-y-2 w-full sm:w-40">
            <Label>Pass %</Label>
            <Input type="number" value={passPercent} onChange={(e) => setPassPercent(parseInt(e.target.value || '0', 10))} />
          </div>
          <div className="space-y-2 w-full sm:w-auto">
            <Label>Published</Label>
            <select className="border rounded px-3 py-2" value={published ? '1' : '0'} onChange={(e) => setPublished(e.target.value === '1')}>
              <option value="0">No</option>
              <option value="1">Yes</option>
            </select>
          </div>
        </div>

        <Card className="border-0 shadow-soft">
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="space-y-3">
                <div className="font-medium">Question {idx + 1}</div>
                <Input value={q.question} onChange={(e) => setQuestions(prev => prev.map((qq, i) => i === idx ? { ...qq, question: e.target.value } : qq))} placeholder="Enter question" />
                <div className="space-y-2">
                  {q.options.map((o, oi) => (
                    <div key={oi} className="flex gap-2 items-center">
                      <input type="radio" name={`correct-${idx}`} checked={o.is_correct} onChange={() => setQuestions(prev => prev.map((qq, i) => i === idx ? { ...qq, options: qq.options.map((oo, ooi) => ({ ...oo, is_correct: ooi === oi })) } : qq))} />
                      <Input value={o.text} onChange={(e) => setQuestions(prev => prev.map((qq, i) => i === idx ? { ...qq, options: qq.options.map((oo, ooi) => ooi === oi ? { ...oo, text: e.target.value } : oo) } : qq))} placeholder={`Option ${oi + 1}`} />
                      <Button variant="ghost" onClick={() => setQuestions(prev => prev.map((qq, i) => i === idx ? { ...qq, options: qq.options.filter((_, ooi) => ooi !== oi) } : qq))}>Remove</Button>
                    </div>
                  ))}
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={() => setQuestions(prev => prev.map((qq, i) => i === idx ? { ...qq, options: [...qq.options, { text: '', is_correct: false }] } : qq))}>Add option</Button>
                  <Button variant="destructive" onClick={() => setQuestions(prev => prev.filter((_, i) => i !== idx))}>Delete question</Button>
                </div>
              </div>
            ))}
            <Button onClick={addQuestion}>Add question</Button>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-primary hover:bg-primary-hover" onClick={save}>Save Test</Button>
        </div>
      </div>
    </RequireAdmin>
  );
}


