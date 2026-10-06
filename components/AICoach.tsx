"use client";
import { useState } from "react";
import { offlineCoaching } from "../lib/coach";
import { buildCoachRequest, type Habit, type MoodLog } from "../lib/habits";

type AICoachProps = {
  habits: Habit[];
  moods: MoodLog;
};

export default function AICoach({ habits, moods }: AICoachProps) {
  const [question, setQuestion] = useState("");
  const [advice, setAdvice] = useState("");
  const [source, setSource] = useState<"ai" | "offline" | null>(null);
  const [loading, setLoading] = useState(false);

  const askCoach = async (e?: React.FormEvent) => {
    e?.preventDefault();
    const payload = buildCoachRequest(habits, moods, question);
    setLoading(true);
    try {
      const res = await fetch("/api/coach", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setAdvice(data.advice);
      setSource(data.source);
    } catch {
      // Network or server failure: still give the user something useful.
      setAdvice(offlineCoaching(payload));
      setSource("offline");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-gray-800">Your AI Coach 🤖</h2>
      <form onSubmit={askCoach} className="flex flex-col gap-2">
        <input
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ask something (optional), e.g. how do I stay consistent?"
          aria-label="Question for your coach"
          maxLength={500}
          className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-purple-400"
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 disabled:opacity-50"
        >
          {loading ? "Thinking..." : "Get coaching"}
        </button>
      </form>
      {advice && (
        <div className="mt-4 bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="whitespace-pre-line text-gray-800">{advice}</p>
          {source === "offline" && (
            <p className="text-xs text-gray-500 mt-3">
              Offline tips. Set ANTHROPIC_API_KEY on the server for AI coaching.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
