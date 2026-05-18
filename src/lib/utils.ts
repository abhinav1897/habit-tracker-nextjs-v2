import type { Completions } from '@/types'

export function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

export function getWeekDays(): Date[] {
  const today = new Date()
  const dow = today.getDay()
  const days: Date[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - dow + i)
    days.push(d)
  }
  return days
}

export function calcStreak(habitId: string, completions: Completions): number {
  let streak = 0
  const d = new Date()
  const todayDone = (completions[todayKey()] ?? []).includes(habitId)
  if (!todayDone) d.setDate(d.getDate() - 1)
  while (true) {
    const k = dateKey(d)
    if ((completions[k] ?? []).includes(habitId)) {
      streak++
      d.setDate(d.getDate() - 1)
    } else break
  }
  return streak
}
