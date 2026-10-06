import type { CoachRequest } from "./habits";

const LOW_MOODS = new Set(["😔", "😢"]);

// Rule-based tips used when the AI coach isn't configured or is unreachable.
export function offlineCoaching({ habits, moods }: CoachRequest): string {
  if (habits.length === 0) {
    return "Start small: add one habit you can do in under two minutes, like drinking a glass of water after waking up. Tiny wins build momentum.";
  }

  const tips: string[] = [];
  const pending = habits.filter((h) => !h.doneToday);
  const best = [...habits].sort((a, b) => b.currentStreak - a.currentStreak)[0];
  const struggling = habits.filter((h) => h.last7DaysRate < 0.4);

  if (pending.length === 0) {
    tips.push("Every habit is checked off today. Great work, and enjoy the rest of your day.");
  } else {
    tips.push(
      `Still to do today: ${pending.map((h) => h.name).join(", ")}. Pick the easiest one and do it now.`,
    );
  }

  if (best && best.currentStreak >= 2) {
    tips.push(`"${best.name}" is on a ${best.currentStreak}-day streak. Protect it, even with a smaller version on busy days.`);
  }

  if (struggling.length > 0) {
    tips.push(
      `"${struggling[0].name}" has been hard this week. Try shrinking it or tying it to something you already do every day, like after breakfast.`,
    );
  }

  const recentMood = moods.at(-1)?.mood;
  if (recentMood && LOW_MOODS.has(recentMood)) {
    tips.push("You've been feeling low lately. Be kind to yourself and aim for just one habit today. Consistency beats intensity.");
  }

  if (habits.length > 5) {
    tips.push("You're tracking a lot of habits. Consider focusing on your top three until they feel automatic.");
  }

  return tips.join("\n\n");
}
