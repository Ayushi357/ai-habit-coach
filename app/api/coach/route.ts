import Anthropic from "@anthropic-ai/sdk";
import { NextResponse } from "next/server";
import { offlineCoaching } from "@/lib/coach";
import type { CoachRequest } from "@/lib/habits";

const MODEL = "claude-opus-5-5";

const SYSTEM_PROMPT = `You are a warm, practical habit coach inside a habit-tracking app.
You receive the user's habits with today's status, streaks and 7-day completion rate, plus their recent mood log (emoji).
Give short, specific, encouraging coaching grounded in their actual data: celebrate streaks, suggest one or two concrete next steps, and adjust the tone to their mood.
If they ask a question, answer it directly.
Keep it under 150 words, use plain text with short paragraphs or a brief list, and don't invent data you weren't given.
You are not a medical professional; if the user describes a serious mental health concern, gently suggest talking to someone they trust or a professional.`;

// Bound what we forward to the model so a crafted request can't run up cost.
function sanitize(body: unknown): CoachRequest | null {
  if (!body || typeof body !== "object") return null;
  const { habits, moods, question } = body as Partial<CoachRequest>;
  if (!Array.isArray(habits) || !Array.isArray(moods)) return null;
  return {
    habits: habits.slice(0, 30).map((h) => ({
      name: String(h?.name ?? "").slice(0, 100),
      doneToday: Boolean(h?.doneToday),
      currentStreak: Number(h?.currentStreak) || 0,
      longestStreak: Number(h?.longestStreak) || 0,
      last7DaysRate: Number(h?.last7DaysRate) || 0,
    })),
    moods: moods.slice(0, 14).map((m) => ({
      date: String(m?.date ?? "").slice(0, 10),
      mood: String(m?.mood ?? "").slice(0, 8),
    })),
    question: typeof question === "string" ? question.slice(0, 500) : undefined,
  };
}

export async function POST(req: Request) {
  let data: CoachRequest | null;
  try {
    data = sanitize(await req.json());
  } catch {
    data = null;
  }
  if (!data) {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const offline = () =>
    NextResponse.json({ advice: offlineCoaching(data), source: "offline" });

  if (!process.env.ANTHROPIC_API_KEY) return offline();

  const userMessage = [
    `Today's date: ${new Date().toISOString().slice(0, 10)}`,
    `My habit data:\n${JSON.stringify(data.habits, null, 2)}`,
    `My recent moods:\n${JSON.stringify(data.moods, null, 2)}`,
    data.question ? `My question: ${data.question}` : "Please give me today's coaching.",
  ].join("\n\n");

  try {
    const client = new Anthropic();
    const response = await client.beta.messages.create({
      model: MODEL,
      max_tokens: 16000,
      output_config: { effort: "low" },
      betas: ["server-side-fallback-2026-07-01"],
      fallbacks: "default",
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userMessage }],
    });

    if (response.stop_reason === "refusal") return offline();

    const advice = response.content
      .flatMap((block) => (block.type === "text" ? [block.text] : []))
      .join("\n")
      .trim();
    if (!advice) return offline();

    return NextResponse.json({ advice, source: "ai" });
  } catch (error) {
    if (error instanceof Anthropic.AuthenticationError) {
      console.error("Coach: invalid ANTHROPIC_API_KEY");
    } else if (error instanceof Anthropic.RateLimitError) {
      console.error("Coach: rate limited");
    } else if (error instanceof Anthropic.APIError) {
      console.error(`Coach: API error ${error.status}`, error.message);
    } else {
      console.error("Coach: unexpected error", error);
    }
    return offline();
  }
}
