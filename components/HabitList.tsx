"use client";
import {
  currentStreak,
  dateKey,
  isDoneOn,
  lastNDays,
  type Habit,
} from "../lib/habits";

type HabitListProps = {
  habits: Habit[];
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
};

export default function HabitList({ habits, onToggle, onDelete }: HabitListProps) {
  if (habits.length === 0) {
    return (
      <p className="text-gray-500 text-center py-6">
        No habits yet. Add your first one above!
      </p>
    );
  }

  const today = dateKey();
  const week = lastNDays(7);

  return (
    <ul className="space-y-2">
      {habits.map((habit) => {
        const done = isDoneOn(habit, today);
        const streak = currentStreak(habit);
        return (
          <li
            key={habit.id}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg border ${
              done ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"
            }`}
          >
            <input
              type="checkbox"
              checked={done}
              onChange={() => onToggle(habit.id)}
              aria-label={`Mark "${habit.name}" done today`}
              className="w-5 h-5 accent-green-600 cursor-pointer"
            />
            <div className="flex-1 min-w-0">
              <p className={`truncate ${done ? "text-gray-500 line-through" : "text-gray-800"}`}>
                {habit.name}
              </p>
              <div className="flex items-center gap-1 mt-1" aria-label="Last 7 days">
                {week.map((day) => (
                  <span
                    key={day}
                    title={day}
                    className={`w-2.5 h-2.5 rounded-full ${
                      isDoneOn(habit, day) ? "bg-green-500" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
            <span
              className="text-sm text-orange-600 whitespace-nowrap"
              title="Current streak"
            >
              🔥 {streak}
            </span>
            <button
              onClick={() => {
                if (confirm(`Delete "${habit.name}"?`)) onDelete(habit.id);
              }}
              aria-label={`Delete "${habit.name}"`}
              className="text-gray-400 hover:text-red-500 px-1"
            >
              ✕
            </button>
          </li>
        );
      })}
    </ul>
  );
}
