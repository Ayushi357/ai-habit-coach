"use client";
import { useEffect, useState } from "react";
import AICoach from "../components/AICoach";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import MoodTracker from "../components/MoodTracker";
import StatsSummary from "../components/StatsSummary";
import {
  createHabit,
  dateKey,
  migrateHabits,
  toggleCompletion,
  type Habit,
  type MoodLog,
} from "../lib/habits";

const HABITS_KEY = "habits";
const MOODS_KEY = "moods";
const LEGACY_MOOD_KEY = "todayMood";

function readJson(key: string): unknown {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export default function Home() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [moods, setMoods] = useState<MoodLog>({});
  // Don't write to localStorage until we've read it, or the empty initial
  // state would overwrite saved data.
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setHabits(migrateHabits(readJson(HABITS_KEY)));

    const storedMoods = readJson(MOODS_KEY);
    const moodLog: MoodLog =
      storedMoods && typeof storedMoods === "object" ? (storedMoods as MoodLog) : {};
    // Carry over the single mood saved by older versions as today's entry.
    const legacyMood = localStorage.getItem(LEGACY_MOOD_KEY);
    if (legacyMood && !moodLog[dateKey()]) moodLog[dateKey()] = legacyMood;
    localStorage.removeItem(LEGACY_MOOD_KEY);
    setMoods(moodLog);

    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) localStorage.setItem(HABITS_KEY, JSON.stringify(habits));
  }, [habits, loaded]);

  useEffect(() => {
    if (loaded) localStorage.setItem(MOODS_KEY, JSON.stringify(moods));
  }, [moods, loaded]);

  const addHabit = (name: string) => setHabits((prev) => [...prev, createHabit(name)]);

  const toggleHabit = (id: string) =>
    setHabits((prev) => prev.map((h) => (h.id === id ? toggleCompletion(h) : h)));

  const deleteHabit = (id: string) => setHabits((prev) => prev.filter((h) => h.id !== id));

  const selectMood = (mood: string) => setMoods((prev) => ({ ...prev, [dateKey()]: mood }));

  return (
    <main className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="max-w-xl mx-auto flex flex-col gap-6">
        <header className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">AI Habit Coach 🚀</h1>
          <p className="text-gray-600 mt-2">Track your habits & get AI-powered coaching</p>
        </header>

        <StatsSummary habits={habits} />

        <section className="bg-white p-6 rounded-2xl shadow flex flex-col gap-4">
          <h2 className="text-xl font-semibold text-gray-800">Today&apos;s habits</h2>
          <HabitForm onAddHabit={addHabit} />
          {loaded && (
            <HabitList habits={habits} onToggle={toggleHabit} onDelete={deleteHabit} />
          )}
        </section>

        <section className="bg-white p-6 rounded-2xl shadow">
          <MoodTracker moods={moods} onSelect={selectMood} />
        </section>

        <section className="bg-white p-6 rounded-2xl shadow">
          <AICoach habits={habits} moods={moods} />
        </section>
      </div>
    </main>
  );
}
