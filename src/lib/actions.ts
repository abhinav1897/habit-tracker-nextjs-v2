'use server'
import { revalidatePath } from 'next/cache'
import { addHabitToStore, toggleHabitInStore, deleteHabitFromStore } from './store'
import { todayKey } from './utils'
import { createClient } from '@/lib/supabase/server'
import type { Habit } from '@/types'

export async function addHabit(name: string, emoji: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  const habit: Habit = {
    id: Date.now().toString(),
    name,
    emoji,
    createdAt: todayKey(),
  }
  await addHabitToStore(habit, user.id)
  revalidatePath('/')
}

export async function toggleHabit(habitId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await toggleHabitInStore(habitId, todayKey())
  revalidatePath('/')
}

export async function deleteHabit(habitId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Not authenticated')

  await deleteHabitFromStore(habitId, user.id)
  revalidatePath('/')
}
