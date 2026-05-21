# Habit Tracker

A daily habit tracker with user accounts, streaks, and a weekly completion view. Built with Next.js, Supabase, and deployed on Vercel.

**Live:** https://habit-tracker-nextjs-v2.vercel.app

## Features

- Sign up and sign in — one combined form, no separate pages
- Add and delete habits with a name and emoji
- Mark habits as done each day — per-user, isolated from all other accounts
- Streak counter per habit
- Weekly completion view
- Stats page — total habits, completion rate, all-time completions per habit
- PostHog analytics

## Tech Stack

- **Next.js 15** — App Router, Server Components, Server Actions
- **Supabase** — hosted Postgres database + Auth (sessions, JWT, email confirmation)
- **TypeScript**
- **Vercel** — hosting and deployment
- **PostHog** — analytics

## Architecture

```
src/
├── app/
│   ├── layout.tsx          — root layout, shared nav bar
│   ├── page.tsx            — home page (Server Component)
│   ├── stats/
│   │   └── page.tsx        — stats page (Server Component)
│   └── auth/
│       ├── page.tsx        — sign in / sign up page
│       ├── AuthForm.tsx    — form with useActionState (Client Component)
│       └── actions.ts      — sign in, sign up, sign out Server Actions
├── components/
│   ├── Nav.tsx             — navigation bar with sign out (Client Component)
│   ├── AddForm.tsx         — add habit form (Client Component)
│   ├── HabitCard.tsx       — individual habit card (Client Component)
│   └── WeeklyView.tsx      — weekly completion grid
└── lib/
    ├── store.ts            — data layer using Supabase JS client
    ├── actions.ts          — habit Server Actions (add, toggle, delete)
    ├── supabase/
    │   ├── server.ts       — server-side Supabase client (reads cookies)
    │   └── client.ts       — browser-side Supabase client
    └── utils.ts            — shared pure helper functions

middleware.ts               — refreshes auth tokens on every request
```

## Database

Postgres on Supabase with two tables:

```sql
habits (
  id         TEXT PRIMARY KEY,
  name       TEXT NOT NULL,
  emoji      TEXT NOT NULL,
  created_at TEXT NOT NULL,
  user_id    UUID NOT NULL REFERENCES auth.users(id)
)

completions (
  habit_id TEXT NOT NULL REFERENCES habits(id) ON DELETE CASCADE,
  date     TEXT NOT NULL,
  PRIMARY KEY (habit_id, date)
)
```

Row-Level Security is enabled on both tables — Postgres enforces that users can only read and modify their own data, independent of application code.

## Running Locally

```bash
npm install
npm run dev
```

Requires a `.env.local` file with:

```
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
NEXT_PUBLIC_POSTHOG_TOKEN=...
NEXT_PUBLIC_POSTHOG_HOST=...
```

## Part of a Learning Journey

Phase 5 of a series building the same habit tracker across progressively more advanced stacks:

| Phase | Stack | Live |
|---|---|---|
| 1 | Vanilla JS | [abhinav1897.github.io](https://abhinav1897.github.io) |
| 2 | React JS | [abhinav1897.github.io/habit-tracker-react](https://abhinav1897.github.io/habit-tracker-react) |
| 3 | React + TypeScript | [abhinav1897.github.io/habit-tracker-react-ts](https://abhinav1897.github.io/habit-tracker-react-ts) |
| 4 | Next.js (static) | [abhinav1897.github.io/habit-tracker-nextjs](https://abhinav1897.github.io/habit-tracker-nextjs) |
| 5 | **Next.js (server) + Auth + DB** | [habit-tracker-nextjs-v2.vercel.app](https://habit-tracker-nextjs-v2.vercel.app) |
