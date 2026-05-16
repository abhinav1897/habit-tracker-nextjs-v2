'use client'
import { useState, useEffect } from 'react'
import AddForm from '@/components/AddForm'
import HabitCard from '@/components/HabitCard'
import WeeklyView from '@/components/WeeklyView'
import type { Habit, Completions } from '@/types'
import { usePostHog } from '@posthog/react'

const STORAGE_KEY = 'habittracker_nextjs'

function todayKey(): string {
  const d = new Date()
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getWeekDays(): Date[] {
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

export default function Home() {
  const posthog = usePostHog()
  const [habits, setHabits] = useState<Habit[]>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')?.habits ?? [] }
    catch { return [] }
  })
  const [completions, setCompletions] = useState<Completions>(() => {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}')?.completions ?? {} }
    catch { return {} }
  })

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ habits, completions }))
  }, [habits, completions])

  function calcStreak(habitId: string): number {
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

  function addHabit(name: string, emoji: string): void {
    const habit: Habit = { id: Date.now().toString(), name, emoji, createdAt: todayKey() }
    setHabits(prev => [...prev, habit])
    posthog?.capture('habit_added', { habit_name: name, habit_emoji: emoji })
  }

  function toggleHabit(habitId: string): void {
    const today = todayKey()
    const todayList = completions[today] ?? []
    const isDone = todayList.includes(habitId)
    setCompletions(prev => ({
      ...prev,
      [today]: isDone
        ? todayList.filter(id => id !== habitId)
        : [...todayList, habitId],
    }))
  }

  function deleteHabit(habitId: string): void {
    const habit = habits.find(h => h.id === habitId)
    posthog?.capture('habit_deleted', { habit_name: habit?.name, habit_emoji: habit?.emoji })
    setHabits(prev => prev.filter(h => h.id !== habitId))
    setCompletions(prev => {
      const updated = { ...prev }
      Object.keys(updated).forEach(date => {
        updated[date] = updated[date].filter(id => id !== habitId)
      })
      return updated
    })
  }

  const today = todayKey()
  const todayList = completions[today] ?? []
  const weekDays = getWeekDays()
  const hasHabits = habits.length > 0
  const doneCount = habits.filter(h => todayList.includes(h.id)).length
  const pct = hasHabits ? Math.round((doneCount / habits.length) * 100) : 0

  return (
    <div>
      <header>
        <h1>Habit<span>.</span></h1>
        <span className="date-label">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </header>

      <div className="main">
        <AddForm onAdd={addHabit} />

        {hasHabits && (
          <div className="progress-bar-wrap">
            <div className="progress-header">
              <span>Today&apos;s progress</span>
              <span>{doneCount} / {habits.length}</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: pct + '%' }} />
            </div>
          </div>
        )}

        {hasHabits && <div className="section-title">Today</div>}

        <div className="habits-list">
          {!hasHabits ? (
            <div className="empty-state">
              <div className="icon">🌱</div>
              <p>No habits yet. Add one above to get started!</p>
            </div>
          ) : (
            habits.map(habit => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isDone={todayList.includes(habit.id)}
                streak={calcStreak(habit.id)}
                onToggle={toggleHabit}
                onDelete={deleteHabit}
              />
            ))
          )}
        </div>

        {hasHabits && (
          <WeeklyView
            habits={habits}
            completions={completions}
            weekDays={weekDays}
            today={today}
          />
        )}
      </div>
    </div>
  )
}
