"use client";
import { useState, useEffect } from "react";

const moods = ["😃", "🙂", "😐", "😔", "😢"];

export default function MoodTracker() {
  const [todayMood, setTodayMood] = useState<string>("");

  useEffect(() => {
    const storedMood = localStorage.getItem("todayMood");
    if (storedMood) setTodayMood(storedMood);
  }, []);

  const selectMood = (mood: string) => {
    setTodayMood(mood);
    localStorage.setItem("todayMood", mood);
  };

  return (
    <div className="mt-8 w-full max-w-md bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-2">How are you feeling today?</h2>
      <div className="flex gap-3">
        {moods.map((mood) => (
          <button
            key={mood}
            className={`text-2xl p-2 rounded ${
              todayMood === mood ? "bg-blue-200" : ""
            }`}
            onClick={() => selectMood(mood)}
          >
            {mood}
          </button>
        ))}
      </div>
    </div>
  );
}
