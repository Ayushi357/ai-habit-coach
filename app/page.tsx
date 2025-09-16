"use client";
import { useState, useEffect } from "react";
import HabitForm from "../components/HabitForm";
import HabitList from "../components/HabitList";
import MoodTracker from "../components/MoodTracker";

export default function Home() {
  const [habits, setHabits] = useState<string[]>([]);

  // Load habits from localStorage on mount
  useEffect(() => {
    const storedHabits = localStorage.getItem("habits");
    if (storedHabits) setHabits(JSON.parse(storedHabits));
  }, []);

  // Save habits to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("habits", JSON.stringify(habits));
  }, [habits]);

  const addHabit = (habit: string) => {
    setHabits((prev) => [...prev, habit]);
  };

  return (
    <main className="min-h-screen flex flex-col items-center p-8 bg-gray-50">
      <h1 className="text-3xl font-bold text-blue-600">AI Habit Coach 🚀</h1>
      <p className="text-gray-600 mt-2">
        Track your habits & get AI-powered coaching
      </p>

      <HabitForm onAddHabit={addHabit} />
      <HabitList habits={habits} />
      <MoodTracker />
    </main>
  );
}
