"use client";
import { useState } from "react";

type HabitFormProps = {
  onAddHabit: (habit: string) => void;
};

export default function HabitForm({ onAddHabit }: HabitFormProps) {
  const [habit, setHabit] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!habit.trim()) return;
    onAddHabit(habit);
    setHabit("");
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={habit}
        onChange={(e) => setHabit(e.target.value)}
        placeholder="Enter a new habit..."
        aria-label="New habit"
        maxLength={100}
        className="border border-gray-300 bg-white text-gray-900 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50"
        disabled={!habit.trim()}
      >
        Add
      </button>
    </form>
  );
}
