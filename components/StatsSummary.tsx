import { currentStreak, dateKey, isDoneOn, longestStreak, type Habit } from "../lib/habits";

export default function StatsSummary({ habits }: { habits: Habit[] }) {
  const today = dateKey();
  const doneToday = habits.filter((h) => isDoneOn(h, today)).length;
  const bestCurrent = Math.max(0, ...habits.map(currentStreak));
  const bestEver = Math.max(0, ...habits.map(longestStreak));

  const stats = [
    { label: "Done today", value: `${doneToday}/${habits.length}` },
    { label: "Top streak", value: `${bestCurrent}d` },
    { label: "Best ever", value: `${bestEver}d` },
  ];

  return (
    <div className="grid grid-cols-3 gap-3">
      {stats.map((s) => (
        <div key={s.label} className="bg-white rounded-xl shadow p-4 text-center">
          <p className="text-2xl font-bold text-blue-600">{s.value}</p>
          <p className="text-xs text-gray-500 mt-1">{s.label}</p>
        </div>
      ))}
    </div>
  );
}
