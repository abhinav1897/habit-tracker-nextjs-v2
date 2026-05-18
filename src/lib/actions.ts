'use server'
import { revalidatePath } from 'next/cache'
import { addHabitToStore, toggleHabitInStore, deleteHabitFromStore } from './store'
import { todayKey } from './utils'
import type { Habit } from '@/types'

export async function addHabit(name: string, emoji: string): Promise<void> {
  const habit: Habit = {
    id: Date.now().toString(),
    name,
    emoji,
    createdAt: todayKey(),
  }
  addHabitToStore(habit)
  revalidatePath('/')
}

export async function toggleHabit(habitId: string): Promise<void> {
  toggleHabitInStore(habitId, todayKey())
  revalidatePath('/')
}

export async function deleteHabit(habitId: string): Promise<void> {
  deleteHabitFromStore(habitId)
  revalidatePath('/')
}
