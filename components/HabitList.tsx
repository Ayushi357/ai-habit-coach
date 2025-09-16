type HabitListProps = {
  habits: string[];
};

export default function HabitList({ habits }: HabitListProps) {
  return (
    <ul className="mt-6 space-y-2">
      {habits.map((habit, idx) => (
        <li
          key={idx}
          className="bg-gray-100 px-4 py-2 rounded shadow-sm text-gray-700"
        >
          {habit}
        </li>
      ))}
    </ul>
  );
}
