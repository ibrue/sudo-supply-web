"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@clerk/nextjs";

const clerkKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY ?? "";
const isClerkConfigured = /^pk_(test|live)_/.test(clerkKey) && !clerkKey.includes("placeholder") && !clerkKey.includes("...") && clerkKey.length >= 24;

function SignedInOnly({ children }: { children: (signedIn: boolean) => React.ReactNode }) {
  const { isSignedIn } = useAuth();
  return <>{children(!!isSignedIn)}</>;
}

function AuthGate({ children }: { children: (signedIn: boolean) => React.ReactNode }) {
  if (!isClerkConfigured) return <>{children(false)}</>;
  return <SignedInOnly>{children}</SignedInOnly>;
}

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

  const textareaClass =
    "w-full bg-transparent border border-border rounded-xl p-3 text-sm text-text focus:border-accent outline-none resize-none";

  return (
    <AuthGate>
      {(isSignedIn) => (
    <section>
      <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mb-6">
        Questions &amp; answers
      </h2>

      {loading ? (
        <p className="text-text-muted text-sm font-mono">
          $ sudo cat /qa/{slug} <span className="animate-blink">▌</span>
        </p>
      ) : questions.length === 0 ? (
        <div className="rounded-2xl border border-border bg-surface p-6 mb-6 text-center">
          <p className="font-pixel text-accent text-xl mb-2">[ ? ]</p>
          <p className="text-text-muted text-sm">No questions yet. Be the first to ask.</p>
        </div>
      ) : (
        <div className="space-y-3 mb-6">
          {questions.map((q) => (
            <div key={q.id} className="rounded-2xl border border-border bg-surface p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-accent text-xs font-mono uppercase tracking-wider">Q</span>
                <span className="text-text-muted text-xs font-mono">{q.user_name}</span>
              </div>
              <p className="text-text mb-3">{q.body}</p>

              {q.answers.length > 0 && (
                <div className="space-y-3 border-l-2 border-accent/30 pl-4 mt-4">
                  {q.answers.map((a) => (
                    <div key={a.id}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-accent text-xs font-mono uppercase tracking-wider">A</span>
                        <span className="text-text-muted text-xs font-mono">{a.user_name}</span>
                      </div>
                      <p className="text-text-muted text-sm">{a.body}</p>
                    </div>
                  ))}
                </div>
              )}

              {isSignedIn && answeringId !== q.id && (
                <button
                  onClick={() => {
                    setAnsweringId(q.id);
                    setAnswerBody("");
                  }}
                  className="text-accent text-sm hover:underline mt-3"
                >
                  Reply →
                </button>
              )}

              {answeringId === q.id && (
                <form onSubmit={(e) => handleAnswer(e, q.id)} className="mt-3 space-y-3">
                  <textarea
                    value={answerBody}
                    onChange={(e) => setAnswerBody(e.target.value)}
                    placeholder="Your answer…"
                    required
                    rows={2}
                    className={textareaClass}
                  />
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={submitting || !answerBody.trim()}
                      className="px-4 py-2 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
                    >
                      {submitting ? "Posting…" : "Post"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setAnsweringId(null)}
                      className="px-4 py-2 text-sm rounded-full border border-border hover:bg-white/5 transition"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </div>
          ))}
        </div>
      )}

      {isSignedIn && (
        <form onSubmit={handleAskQuestion} className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <p className="text-xs uppercase tracking-[0.2em] text-text-muted font-mono">
            Ask a question
          </p>
          <textarea
            value={questionBody}
            onChange={(e) => setQuestionBody(e.target.value)}
            placeholder="What do you want to know?"
            required
            rows={2}
            className={textareaClass}
          />
          <button
            type="submit"
            disabled={submitting || !questionBody.trim()}
            className="px-5 py-2.5 text-sm font-semibold rounded-full text-black bg-accent hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
          >
            {submitting ? "Posting…" : "Ask question"}
          </button>
        </form>
      )}
    </section>
      )}
    </AuthGate>
  );
}
