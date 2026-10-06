"use client";
import { dateKey, lastNDays, MOODS, type MoodLog } from "../lib/habits";

type MoodTrackerProps = {
  moods: MoodLog;
  onSelect: (mood: string) => void;
};

export default function MoodTracker({ moods, onSelect }: MoodTrackerProps) {
  const todayMood = moods[dateKey()];

  return (
    <div>
      <h2 className="text-xl font-semibold mb-3 text-gray-800">How are you feeling today?</h2>
      <div className="flex gap-2">
        {MOODS.map((mood) => (
          <button
            key={mood}
            aria-pressed={todayMood === mood}
            className={`text-2xl p-2 rounded-lg transition ${
              todayMood === mood ? "bg-blue-200 scale-110" : "hover:bg-gray-100"
            }`}
            onClick={() => onSelect(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-sm text-gray-500 mb-1">Last 7 days</p>
        <div className="flex gap-2">
          {lastNDays(7).map((day) => (
            <div key={day} className="flex flex-col items-center w-8">
              <span className="text-lg h-7">{moods[day] ?? "·"}</span>
              <span className="text-[10px] text-gray-400">
                {new Date(`${day}T00:00:00`).toLocaleDateString(undefined, { weekday: "narrow" })}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
