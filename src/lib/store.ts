import type { SupabaseClient } from '@supabase/supabase-js'
import type { Habit, Completions } from '@/types'

export async function getHabits(supabase: SupabaseClient): Promise<Habit[]> {
  const { data } = await supabase
    .from('habits')
    .select('id, name, emoji, created_at')
    .order('id')
  return (data ?? []).map(row => ({
    id: row.id,
    name: row.name,
    emoji: row.emoji,
    createdAt: row.created_at,
  }))
}

export async function getCompletions(supabase: SupabaseClient): Promise<Completions> {
  const { data } = await supabase
    .from('completions')
    .select('habit_id, date')
  const completions: Completions = {}
  for (const row of data ?? []) {
    if (!completions[row.date]) completions[row.date] = []
    completions[row.date].push(row.habit_id)
  }
  return completions
}

export async function addHabitToStore(habit: Habit, userId: string, supabase: SupabaseClient): Promise<void> {
  await supabase.from('habits').insert({
    id: habit.id,
    name: habit.name,
    emoji: habit.emoji,
    created_at: habit.createdAt,
    user_id: userId,
  })
}

export async function toggleHabitInStore(habitId: string, date: string, supabase: SupabaseClient): Promise<void> {
  const { data: existing } = await supabase
    .from('completions')
    .select('habit_id')
    .eq('habit_id', habitId)
    .eq('date', date)
    .maybeSingle()
  if (existing) {
    await supabase.from('completions').delete().eq('habit_id', habitId).eq('date', date)
  } else {
    await supabase.from('completions').insert({ habit_id: habitId, date })
  }
}

export async function deleteHabitFromStore(habitId: string, supabase: SupabaseClient): Promise<void> {
  await supabase.from('habits').delete().eq('id', habitId)
}
