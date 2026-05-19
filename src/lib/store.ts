import db from './db'
import type { Habit, Completions } from '@/types'

export function getHabits(): Habit[] {
  return db.prepare(
    'SELECT id, name, emoji, created_at as createdAt FROM habits ORDER BY rowid'
  ).all() as Habit[]
}

export function getCompletions(): Completions {
  const rows = db.prepare(
    'SELECT habit_id, date FROM completions'
  ).all() as { habit_id: string; date: string }[]

  const completions: Completions = {}
  for (const row of rows) {
    if (!completions[row.date]) completions[row.date] = []
    completions[row.date].push(row.habit_id)
  }
  return completions
}

export function addHabitToStore(habit: Habit): void {
  db.prepare(
    'INSERT INTO habits (id, name, emoji, created_at) VALUES (?, ?, ?, ?)'
  ).run(habit.id, habit.name, habit.emoji, habit.createdAt)
}

export function toggleHabitInStore(habitId: string, date: string): void {
  const existing = db.prepare(
    'SELECT 1 FROM completions WHERE habit_id = ? AND date = ?'
  ).get(habitId, date)

  if (existing) {
    db.prepare(
      'DELETE FROM completions WHERE habit_id = ? AND date = ?'
    ).run(habitId, date)
  } else {
    db.prepare(
      'INSERT INTO completions (habit_id, date) VALUES (?, ?)'
    ).run(habitId, date)
  }
}

export function deleteHabitFromStore(habitId: string): void {
  db.prepare('DELETE FROM habits WHERE id = ?').run(habitId)
}
