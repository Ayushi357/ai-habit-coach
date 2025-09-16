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
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        value={habit}
        onChange={(e) => setHabit(e.target.value)}
        placeholder="Enter a new habit..."
        className="border rounded px-3 py-2 w-full"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Add
      </button>
    </form>
  );
}
