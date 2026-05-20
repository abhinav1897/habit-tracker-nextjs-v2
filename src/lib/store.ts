import pool from './db'
import type { Habit, Completions } from '@/types'

export async function getHabits(userId: string): Promise<Habit[]> {
  const result = await pool.query(
    'SELECT id, name, emoji, created_at AS "createdAt" FROM habits WHERE user_id = $1 ORDER BY id',
    [userId]
  )
  return result.rows
}

export async function getCompletions(userId: string): Promise<Completions> {
  const result = await pool.query(
    `SELECT c.habit_id, c.date
     FROM completions c
     JOIN habits h ON c.habit_id = h.id
     WHERE h.user_id = $1`,
    [userId]
  )
  const completions: Completions = {}
  for (const row of result.rows) {
    if (!completions[row.date]) completions[row.date] = []
    completions[row.date].push(row.habit_id)
  }
  return completions
}

export async function addHabitToStore(habit: Habit, userId: string): Promise<void> {
  await pool.query(
    'INSERT INTO habits (id, name, emoji, created_at, user_id) VALUES ($1, $2, $3, $4, $5)',
    [habit.id, habit.name, habit.emoji, habit.createdAt, userId]
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

export async function deleteHabitFromStore(habitId: string, userId: string): Promise<void> {
  await pool.query(
    'DELETE FROM habits WHERE id = $1 AND user_id = $2',
    [habitId, userId]
  )
}
