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
- Toast notification when a habit is added (Supabase Realtime via WebSocket)
- Daily motivational quote fetched from Advice Slip API
- Email notification when a habit is completed (Supabase webhook → Resend)
- REST API exposing habit data as JSON endpoints
- PostHog analytics

## Tech Stack

- **Next.js 15** — App Router, Server Components, Server Actions, Route Handlers
- **Supabase** — hosted Postgres, Auth (sessions, JWT), Realtime (WebSocket), Webhooks
- **Resend** — transactional email API
- **sonner** — toast notifications
- **TypeScript**
- **Vercel** — hosting and deployment
- **PostHog** — analytics

## Architecture

```
src/
├── app/
│   ├── layout.tsx              — root layout, shared nav, Toaster
│   ├── page.tsx                — home page (Server Component)
│   ├── stats/
│   │   └── page.tsx            — stats page (Server Component)
│   ├── auth/
│   │   ├── page.tsx            — sign in / sign up page
│   │   ├── AuthForm.tsx        — form with useActionState (Client Component)
│   │   └── actions.ts          — sign in, sign up, sign out Server Actions
│   └── api/
│       ├── habits/
│       │   ├── route.ts        — GET all habits, POST create habit
│       │   └── [id]/
│       │       ├── route.ts    — DELETE habit by id
│       │       ├── streak/
│       │       │   └── route.ts — GET streak for a habit
│       │       └── complete/
│       │           └── route.ts — POST toggle completion
│       ├── stats/
│       │   └── route.ts        — GET aggregate stats
│       └── webhook/
│           └── completion/
│               └── route.ts    — POST receives Supabase webhook, sends email via Resend
├── components/
│   ├── Nav.tsx                 — navigation bar (hidden on auth page)
│   ├── AddForm.tsx             — add habit form (Client Component)
│   ├── HabitCard.tsx           — individual habit card (Client Component)
│   ├── HabitRealtimeListener.tsx — Supabase Realtime WebSocket subscription (Client Component)
│   └── WeeklyView.tsx          — weekly completion grid
└── lib/
    ├── store.ts                — data layer using Supabase JS client
    ├── actions.ts              — habit Server Actions (add, toggle, delete)
    ├── supabase/
    │   ├── server.ts           — server-side Supabase client (reads cookies)
    │   └── client.ts           — browser-side Supabase client
    └── utils.ts                — shared pure helper functions

middleware.ts                   — refreshes auth tokens on every request
```

## API Endpoints

All endpoints require authentication (same session cookie as the browser).

| Method | Path | Description |
|---|---|---|
| `GET` | `/api/habits` | All habits for the signed-in user |
| `POST` | `/api/habits` | Create a habit (`{ name, emoji }` body) |
| `DELETE` | `/api/habits/[id]` | Delete a habit |
| `GET` | `/api/habits/[id]/streak` | Current streak for a habit |
| `POST` | `/api/habits/[id]/complete` | Toggle today's completion |
| `GET` | `/api/stats` | Aggregate stats — totals, rate, per-habit history |

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
  user_id  UUID NOT NULL REFERENCES auth.users(id),
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
SUPABASE_SERVICE_ROLE_KEY=...
NEXT_PUBLIC_POSTHOG_TOKEN=...
NEXT_PUBLIC_POSTHOG_HOST=...
RESEND_API_KEY=...
```

Note: the webhook endpoint (`/api/webhook/completion`) requires a publicly reachable URL — it won't receive events from Supabase in local development without a tunnelling tool like ngrok.

## Part of a Learning Journey

Phase 5 of a series building the same habit tracker across progressively more advanced stacks:

| Phase | Stack | Live |
|---|---|---|
| 1 | Vanilla JS | [abhinav1897.github.io](https://abhinav1897.github.io) |
| 2 | React JS | [abhinav1897.github.io/habit-tracker-react](https://abhinav1897.github.io/habit-tracker-react) |
| 3 | React + TypeScript | [abhinav1897.github.io/habit-tracker-react-ts](https://abhinav1897.github.io/habit-tracker-react-ts) |
| 4 | Next.js (static) | [abhinav1897.github.io/habit-tracker-nextjs](https://abhinav1897.github.io/habit-tracker-nextjs) |
| 5 | **Next.js (server) + Auth + DB** | [habit-tracker-nextjs-v2.vercel.app](https://habit-tracker-nextjs-v2.vercel.app) |
