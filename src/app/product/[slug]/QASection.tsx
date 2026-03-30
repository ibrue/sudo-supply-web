"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

interface Answer {
  id: string;
  user_name: string;
  body: string;
  created_at: string;
}

interface Question {
  id: string;
  user_name: string;
  body: string;
  created_at: string;
  answers: Answer[];
}

export function QASection({ slug }: { slug: string }) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [questionBody, setQuestionBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [answeringId, setAnsweringId] = useState<string | null>(null);
  const [answerBody, setAnswerBody] = useState("");
  const [refresh, setRefresh] = useState(false);
  const { isSignedIn } = useAuth();

  useEffect(() => {
    fetch(`/api/questions?slug=${slug}`)
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data)) setQuestions(data);
      })
      .finally(() => setLoading(false));
  }, [slug, refresh]);

  async function handleAskQuestion(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ product_slug: slug, body: questionBody }),
    });
    setQuestionBody("");
    setSubmitting(false);
    setRefresh((r) => !r);
  }

  async function handleAnswer(e: React.FormEvent, questionId: string) {
    e.preventDefault();
    setSubmitting(true);
    await fetch("/api/answers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ question_id: questionId, body: answerBody }),
    });
    setAnswerBody("");
    setAnsweringId(null);
    setSubmitting(false);
    setRefresh((r) => !r);
  }

  return (
    <section className="mt-12">
      <h2 className="font-mono text-xs text-accent mb-4">&gt; questions &amp; answers</h2>

      {loading ? (
        <p className="text-text-muted text-sm">Loading...</p>
      ) : questions.length === 0 ? (
        <p className="text-text-muted text-sm mb-6">No questions yet. Be the first to ask.</p>
      ) : (
        <div className="space-y-4 mb-6">
          {questions.map((q) => (
            <div key={q.id} className="glass p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-accent text-xs">Q:</span>
                <span className="text-text-muted text-xs">{q.user_name}</span>
              </div>
              <p className="text-sm text-text mb-3">{q.body}</p>

              {q.answers.length > 0 && (
                <div className="ml-4 space-y-2 border-l border-border pl-4">
                  {q.answers.map((a) => (
                    <div key={a.id}>
                      <div className="flex items-center justify-between">
                        <span className="text-accent text-xs">A:</span>
                        <span className="text-text-muted text-xs">{a.user_name}</span>
                      </div>
                      <p className="text-sm text-text-muted">{a.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {isSignedIn && answeringId !== q.id && (
                <button
                  onClick={() => { setAnsweringId(q.id); setAnswerBody(""); }}
                  className="text-accent text-xs hover-accent mt-2"
                >
                  [ reply ]
                </button>
              )}

              {answeringId === q.id && (
                <form onSubmit={(e) => handleAnswer(e, q.id)} className="mt-3 space-y-2">
                  <textarea
                    value={answerBody}
                    onChange={(e) => setAnswerBody(e.target.value)}
                    placeholder="your answer..."
                    required
                    rows={2}
                    className="w-full bg-transparent border border-border p-2 text-sm text-text font-mono focus:border-accent outline-none resize-none"
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting || !answerBody.trim()}
                      className="btn-terminal text-xs disabled:opacity-50"
                    >
                      {submitting ? "[ ... ]" : "[ SUBMIT ]"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnsweringId(null)}
                      className="text-text-muted text-xs hover-accent"
                    >
                      [ cancel ]
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}

      {isSignedIn && (
        <form onSubmit={handleAskQuestion} className="glass p-4 space-y-4">
          <p className="text-xs text-text-muted">ask a question</p>
          <textarea
            value={questionBody}
            onChange={(e) => setQuestionBody(e.target.value)}
            placeholder="your question..."
            required
            rows={2}
            className="w-full bg-transparent border border-border p-3 text-sm text-text font-mono focus:border-accent outline-none resize-none"
          />
          <button
            type="submit"
            disabled={submitting || !questionBody.trim()}
            className="btn-terminal text-xs disabled:opacity-50"
          >
            {submitting ? "[ SUBMITTING... ]" : "[ ASK QUESTION ]"}
          </button>
        </form>
      )}
    </section>
  );
}
