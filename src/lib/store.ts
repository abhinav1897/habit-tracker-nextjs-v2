import pool from './db'
import type { Habit, Completions } from '@/types'

export async function getHabits(): Promise<Habit[]> {
  const result = await pool.query(
    'SELECT id, name, emoji, created_at AS "createdAt" FROM habits ORDER BY id'
  )
  return result.rows
}

export async function getCompletions(): Promise<Completions> {
  const result = await pool.query('SELECT habit_id, date FROM completions')
  const completions: Completions = {}
  for (const row of result.rows) {
    if (!completions[row.date]) completions[row.date] = []
    completions[row.date].push(row.habit_id)
  }
  return completions
}

export async function addHabitToStore(habit: Habit): Promise<void> {
  await pool.query(
    'INSERT INTO habits (id, name, emoji, created_at) VALUES ($1, $2, $3, $4)',
    [habit.id, habit.name, habit.emoji, habit.createdAt]
  )
}

export async function toggleHabitInStore(habitId: string, date: string): Promise<void> {
  const result = await pool.query(
    'SELECT 1 FROM completions WHERE habit_id = $1 AND date = $2',
    [habitId, date]
  )
  if (result.rows.length > 0) {
    await pool.query(
      'DELETE FROM completions WHERE habit_id = $1 AND date = $2',
      [habitId, date]
    )
  } else {
    await pool.query(
      'INSERT INTO completions (habit_id, date) VALUES ($1, $2)',
      [habitId, date]
    )
  }
}

export async function deleteHabitFromStore(habitId: string): Promise<void> {
  await pool.query('DELETE FROM habits WHERE id = $1', [habitId])
}
