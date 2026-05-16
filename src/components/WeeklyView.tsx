import './WeeklyView.css'
import type { Habit, Completions } from '@/types'

const DAY_LABELS = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa']

function dateKey(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

interface WeeklyViewProps {
  habits: Habit[]
  completions: Completions
  weekDays: Date[]
  today: string
}

function WeeklyView({ habits, completions, weekDays, today }: WeeklyViewProps) {
  return (
    <>
      <div className="section-title">This week</div>
      <div className="weekly-section">
        {habits.map(habit => (
          <div key={habit.id} className="weekly-card">
            <div className="weekly-header">
              <span>{habit.emoji}</span>
              <span className="weekly-name">{habit.name}</span>
            </div>
            <div className="week-days">
              {weekDays.map(day => {
                const key = dateKey(day)
                const isToday = key === today
                const completed = (completions[key] ?? []).includes(habit.id)
                return (
                  <div key={key} className="day-dot">
                    <span className="day-label">{DAY_LABELS[day.getDay()]}</span>
                    <div className={`day-circle ${completed ? 'completed' : ''} ${isToday ? 'today' : ''}`} />
                  </div>
                )
              })}
            </div>
          </div>
        ))}
      </div>
    </>
  )
}

export default WeeklyView
