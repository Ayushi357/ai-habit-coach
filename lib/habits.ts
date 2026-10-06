export type Habit = {
  id: string;
  name: string;
  createdAt: string; // YYYY-MM-DD
  completions: string[]; // YYYY-MM-DD dates the habit was done
};

// Mood emoji keyed by date (YYYY-MM-DD)
export type MoodLog = Record<string, string>;

export const MOODS = ["😃", "🙂", "😐", "😔", "😢"];

// Local-time date key, so "today" matches the user's calendar day.
export function dateKey(date: Date = new Date()): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function daysAgo(n: number, from: Date = new Date()): string {
  const d = new Date(from);
  d.setDate(d.getDate() - n);
  return dateKey(d);
}

// Last `n` date keys, oldest first, ending today.
export function lastNDays(n: number): string[] {
  return Array.from({ length: n }, (_, i) => daysAgo(n - 1 - i));
}

export function newId(): string {
  return typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function createHabit(name: string): Habit {
  return { id: newId(), name: name.trim(), createdAt: dateKey(), completions: [] };
}

export function isDoneOn(habit: Habit, day: string): boolean {
  return habit.completions.includes(day);
}

export function toggleCompletion(habit: Habit, day: string = dateKey()): Habit {
  const completions = isDoneOn(habit, day)
    ? habit.completions.filter((d) => d !== day)
    : [...habit.completions, day].sort();
  return { ...habit, completions };
}

// Consecutive days completed, ending today — or yesterday if today isn't
// checked off yet, so the streak doesn't look broken first thing in the morning.
export function currentStreak(habit: Habit): number {
  const done = new Set(habit.completions);
  let offset = done.has(daysAgo(0)) ? 0 : 1;
  let streak = 0;
  while (done.has(daysAgo(offset))) {
    streak++;
    offset++;
  }
  return streak;
}

export function longestStreak(habit: Habit): number {
  const days = [...new Set(habit.completions)].sort();
  let best = 0;
  let run = 0;
  let prev: Date | null = null;
  for (const day of days) {
    const cur = new Date(`${day}T00:00:00`);
    const diff = prev ? Math.round((cur.getTime() - prev.getTime()) / 86400000) : 0;
    run = diff === 1 ? run + 1 : 1;
    best = Math.max(best, run);
    prev = cur;
  }
  return best;
}

// Share of the last `n` days the habit was completed (0–1), counting only
// days since the habit was created.
export function completionRate(habit: Habit, n = 7): number {
  const days = lastNDays(n).filter((d) => d >= habit.createdAt);
  if (days.length === 0) return 0;
  return days.filter((d) => isDoneOn(habit, d)).length / days.length;
}

// Older versions stored habits as plain strings; upgrade them in place.
export function migrateHabits(raw: unknown): Habit[] {
  if (!Array.isArray(raw)) return [];
  return raw.flatMap((item): Habit[] => {
    if (typeof item === "string") return item.trim() ? [createHabit(item)] : [];
    if (item && typeof item === "object" && typeof item.name === "string") {
      return [
        {
          id: typeof item.id === "string" ? item.id : newId(),
          name: item.name,
          createdAt: typeof item.createdAt === "string" ? item.createdAt : dateKey(),
          completions: Array.isArray(item.completions)
            ? item.completions.filter((d: unknown) => typeof d === "string")
            : [],
        },
      ];
    }
    return [];
  });
}

// Compact summary sent to the coach (both AI and offline).
export type CoachHabitSummary = {
  name: string;
  doneToday: boolean;
  currentStreak: number;
  longestStreak: number;
  last7DaysRate: number;
};

export type CoachRequest = {
  habits: CoachHabitSummary[];
  moods: { date: string; mood: string }[];
  question?: string;
};

export function buildCoachRequest(
  habits: Habit[],
  moods: MoodLog,
  question?: string,
): CoachRequest {
  const today = dateKey();
  return {
    habits: habits.map((h) => ({
      name: h.name,
      doneToday: isDoneOn(h, today),
      currentStreak: currentStreak(h),
      longestStreak: longestStreak(h),
      last7DaysRate: Math.round(completionRate(h) * 100) / 100,
    })),
    moods: lastNDays(7)
      .filter((d) => moods[d])
      .map((d) => ({ date: d, mood: moods[d] })),
    question: question?.trim() || undefined,
  };
}
