# Habit Tracker — Next.js (Full Server Mode)

A daily habit tracker built with Next.js in full server mode. Data lives in server memory instead of `localStorage`, mutations happen through Server Actions, and pages are pure Server Components. A learning project exploring what Next.js can do when not constrained to static export.

## Features

- Add and delete habits with a name and emoji
- Mark habits as done each day
- Streak counter per habit
- Weekly completion view
- Stats page — total habits, completion rate, all-time completions per habit
- Shared navigation bar with active route highlighting
- Data stored in server memory (persists across page refreshes, resets on server restart)
- PostHog analytics

## Tech Stack

- Next.js 15 (full server mode)
- TypeScript
- PostHog (analytics)

## Running Locally

```bash
npm install
npm run dev
```

Opens at `http://localhost:3000`

> **Note:** This app requires a running Node.js server and cannot be hosted on GitHub Pages. Deployment to Vercel is planned as a future step.

## Architecture

```
src/
├── app/
│   ├── layout.tsx        — root layout, shared nav bar
│   ├── page.tsx          — home page (Server Component)
│   └── stats/
│       └── page.tsx      — stats page (Server Component)
├── components/
│   ├── Nav.tsx           — navigation bar (Client Component)
│   ├── AddForm.tsx       — add habit form (Client Component)
│   ├── HabitCard.tsx     — individual habit card (Client Component)
│   └── WeeklyView.tsx    — weekly completion grid
└── lib/
    ├── store.ts          — server-side in-memory data store
    ├── actions.ts        — Server Actions (mutations)
    └── utils.ts          — shared pure helper functions
```

## Part of a Learning Journey

This is Phase 5 of a learning series building the same habit tracker across progressively more advanced stacks:

| Phase | Stack | Repo |
|---|---|---|
| 1 | Vanilla JS | [abhinav1897.github.io](https://github.com/abhinav1897/abhinav1897.github.io) |
| 2 | React JS | habit-tracker-react |
| 3 | React + TypeScript | habit-tracker-react-ts |
| 4 | Next.js (static) | habit-tracker-nextjs |
| 5 | **Next.js (server)** | **this repo** |
