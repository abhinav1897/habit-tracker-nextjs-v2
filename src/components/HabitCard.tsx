'use client'
import { useState } from 'react'
import './HabitCard.css'
import type { Habit } from '@/types'
import { usePostHog } from '@posthog/react'

const BURST_COLORS = ['#7c6af7', '#4ade80', '#f472b6', '#facc15', '#38bdf8']

function Burst() {
  const particles = []
  for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * 360
    const dist = 22 + Math.random() * 14
    const tx = Math.cos(angle * Math.PI / 180) * dist
    const ty = Math.sin(angle * Math.PI / 180) * dist
    particles.push(
      <span
        key={i}
        style={{
          '--tx': `${tx}px`,
          '--ty': `${ty}px`,
          background: BURST_COLORS[i % BURST_COLORS.length],
          animationDelay: `${i * 20}ms`,
        } as React.CSSProperties}
      />
    )
  }
  return <div className="burst">{particles}</div>
}

interface HabitCardProps {
  habit: Habit
  isDone: boolean
  streak: number
  onToggle: (id: string) => Promise<void>
  onDelete: (id: string) => Promise<void>
}

function HabitCard({ habit, isDone, streak, onToggle, onDelete }: HabitCardProps) {
  const posthog = usePostHog()
  const [isBursting, setIsBursting] = useState(false)
  const [isPopping, setIsPopping] = useState(false)

  async function handleToggle(): Promise<void> {
    if (!isDone) {
      posthog?.capture('habit_completed', { habit_name: habit.name, habit_emoji: habit.emoji, streak: streak + 1 })
      setIsBursting(true)
      setTimeout(() => setIsBursting(false), 700)
      setIsPopping(true)
      setTimeout(() => setIsPopping(false), 400)
    } else {
      posthog?.capture('habit_uncompleted', { habit_name: habit.name, habit_emoji: habit.emoji, streak })
    }
    await onToggle(habit.id)
  }

  return (
    <div className={`habit-card ${isDone ? 'done' : ''}`}>
      {isBursting && <Burst />}
      <button
        className={`check-btn ${isDone ? 'checked' : ''} ${isPopping ? 'pop' : ''}`}
        onClick={handleToggle}
      >
        <svg viewBox="0 0 16 16">
          <polyline points="3,8 6.5,12 13,4" />
        </svg>
      </button>
      <div className="habit-emoji">{habit.emoji}</div>
      <div className="habit-info">
        <div className="habit-name">{habit.name}</div>
        <div className="habit-streak">
          {streak > 0
            ? <><span className="streak-fire">🔥</span> {streak} day streak</>
            : 'Start your streak today'}
        </div>
      </div>
      <button className="delete-btn" onClick={() => onDelete(habit.id)}>×</button>
    </div>
  )
}

export default HabitCard
