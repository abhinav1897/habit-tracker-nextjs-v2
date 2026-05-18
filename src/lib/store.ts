import type { Habit, Completions } from '@/types'

let habits: Habit[] = []
let completions: Completions = {}

export function getHabits(): Habit[] {
  return habits
}

export function getCompletions(): Completions {
  return completions
}

export function addHabitToStore(habit: Habit): void {
  habits = [...habits, habit]
}

export function toggleHabitInStore(habitId: string, date: string): void {
  const list = completions[date] ?? []
  const isDone = list.includes(habitId)
  completions = {
    ...completions,
    [date]: isDone
      ? list.filter(id => id !== habitId)
      : [...list, habitId],
  }
}

export function deleteHabitFromStore(habitId: string): void {
  habits = habits.filter(h => h.id !== habitId)
  const updated = { ...completions }
  Object.keys(updated).forEach(date => {
    updated[date] = updated[date].filter(id => id !== habitId)
  })
  completions = updated
}
