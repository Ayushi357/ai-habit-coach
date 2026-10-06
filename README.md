# AI Habit Coach 🚀

Track your daily habits and mood, and get personalized coaching from Claude.

## Features

- **Habits**: add, check off for today, and delete habits
- **Streaks**: current streak per habit, a 7-day completion strip, and summary stats (done today, top streak, best ever)
- **Mood tracker**: log how you feel each day, with a 7-day mood history
- **AI coach**: Claude reviews your habits, streaks and recent moods and gives short, specific advice. You can also ask it a question.
- **Offline fallback**: with no API key (or if the API is unreachable), the coach gives rule-based tips instead
- **Local-first**: all data stays in your browser's `localStorage`. Only a summary (habit names, streaks and recent moods) is sent to the coach.

## Getting started

```bash
npm install
cp .env.example .env.local   # then add your ANTHROPIC_API_KEY
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Command         | Description              |
| --------------- | ------------------------ |
| `npm run dev`   | Start the dev server     |
| `npm run build` | Production build         |
| `npm start`     | Run the production build |
| `npm run lint`  | Lint with ESLint         |

## Project structure

```
app/
  page.tsx              Main page: state + localStorage persistence
  api/coach/route.ts    POST endpoint that asks Claude for coaching
components/
  HabitForm.tsx         Add a habit
  HabitList.tsx         Check off, streaks, 7-day strip, delete
  MoodTracker.tsx       Daily mood + history
  StatsSummary.tsx      Summary stat cards
  AICoach.tsx           Coaching UI
lib/
  habits.ts             Habit model, date/streak helpers, data migration
  coach.ts              Offline rule-based coaching
```

## Deploying

Deploy to [Vercel](https://vercel.com/new) (or any Next.js host) and set the `ANTHROPIC_API_KEY` environment variable.
