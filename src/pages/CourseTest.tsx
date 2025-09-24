import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import { useCourse } from "@/hooks/use-courses";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { testService, TestQuestionDto, TestSummary } from "@/lib/test-service";
import { useToast } from "@/hooks/use-toast";

const PASS_PERCENT_FALLBACK = 60;

const CourseTest = () => {
  const { id: courseId } = useParams<{ id: string }>();
  const { data: course, isLoading } = useCourse(courseId ?? "");
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [loadingQuestions, setLoadingQuestions] = useState(true);
  const [questions, setQuestions] = useState<TestQuestionDto[]>([]);
  const [activeTest, setActiveTest] = useState<TestSummary | null>(null);
  const { toast } = useToast();
  useEffect(() => {
    const load = async () => {
      if (!courseId) return;
      try {
        setLoadingQuestions(true);
        const tests = await testService.getTestsForCourse(courseId);
        const published = tests.find((t) => t.is_published) ?? tests[0] ?? null;
        setActiveTest(published);
        if (published) {
          const qs = await testService.getPublishedTestQuestions(published.id);
          setQuestions(qs);
        } else {
          setQuestions([]);
        }
      } catch (e: any) {
        toast({ title: 'Error', description: e.message, variant: 'destructive' });
      } finally {
        setLoadingQuestions(false);
      }
    };
    setAnswers({});
    setSubmitted(false);
    load();
  }, [courseId]);

  useEffect(() => {
    setAnswers({});
    setSubmitted(false);
  }, [courseId]);

  if (isLoading || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Loading test...</h1>
        </div>
      </div>
    );
  }

  const total = questions.length;
  const selectedCount = Object.keys(answers).length;

  const onSubmit = async () => {
    if (!activeTest) return;
    try {
      const payload = Object.entries(answers).map(([question_id, option_id]) => ({ question_id, option_id }));
      const result = await testService.gradeAndStore(activeTest.id, payload);
      setSubmitted(true);
      toast({ title: result.passed ? 'Passed!' : 'Not passed', description: `Score ${result.score}/${result.total} (${result.percent}%)` });
    } catch (e: any) {
      toast({ title: 'Submit failed', description: e.message, variant: 'destructive' });
    }
  };

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">{course.title} — Assessment</h1>
          <p className="text-muted-foreground">
            {activeTest ? `Pass with ${activeTest.pass_percent ?? PASS_PERCENT_FALLBACK}% to unlock certification.` : 'No published test yet.'}
          </p>
        </div>

        <Card className="border-0 shadow-soft">
          <CardContent className="p-6 space-y-8">
            {loadingQuestions && <div className="text-muted-foreground">Loading questions...</div>}
            {!loadingQuestions && questions.length === 0 && (
              <div className="text-muted-foreground">No questions available.</div>
            )}
            {questions.map((q, idx) => (
              <div key={q.id} className="space-y-3">
                <div className="font-semibold text-foreground">{idx + 1}. {q.question}</div>
                <RadioGroup
                  value={answers[q.id] ?? ""}
                  onValueChange={(v) => setAnswers((prev) => ({ ...prev, [q.id]: v }))}
                >
                  {q.options.map((opt) => (
                    <div key={opt.id} className="flex items-center space-x-3 py-1">
                      <RadioGroupItem value={opt.id} id={`${q.id}-${opt.id}`} />
                      <Label htmlFor={`${q.id}-${opt.id}`}>{opt.text}</Label>
                    </div>
                  ))}
                </RadioGroup>
              </div>
            ))}

            <div className="flex flex-col sm:flex-row gap-3 sm:justify-between sm:items-center pt-2">
              <div className="text-sm text-muted-foreground">Answered {selectedCount}/{total}</div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => { setAnswers({}); setSubmitted(false); }}>Clear</Button>
                <Button className="bg-accent hover:bg-accent-hover" disabled={!total || selectedCount < total} onClick={onSubmit}>Submit</Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {submitted && (
          <Card className="border-0 shadow-soft">
            <CardContent className="p-6 space-y-2 text-center">
              <div className="text-foreground font-semibold">Your submission has been recorded.</div>
              <div className="text-sm text-muted-foreground">Check your dashboard for certificate eligibility.</div>
              <div className="flex justify-center gap-2 pt-2">
                <Button variant="outline" onClick={() => { setSubmitted(false); setAnswers({}); }}>Retake</Button>
                <Button className="bg-primary hover:bg-primary-hover" onClick={() => window.history.back()}>Back</Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CourseTest;


