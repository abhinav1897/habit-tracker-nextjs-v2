import AddForm from '@/components/AddForm'
import HabitCard from '@/components/HabitCard'
import WeeklyView from '@/components/WeeklyView'
import HabitRealtimeListener from '@/components/HabitRealtimeListener'
import { getHabits, getCompletions } from '@/lib/store'
import { addHabit, toggleHabit, deleteHabit } from '@/lib/actions'
import { todayKey, getWeekDays, calcStreak } from '@/lib/utils'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function fetchAdvice(): Promise<string> {
  try {
    const res = await fetch('https://api.adviceslip.com/advice', { cache: 'no-store' })
    const data = await res.json()
    return data.slip.advice
  } catch {
    return ''
  }
}

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth')

  const [habits, completions, advice] = await Promise.all([
    getHabits(supabase),
    getCompletions(supabase),
    fetchAdvice(),
  ])
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
        <HabitRealtimeListener />
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
                streak={calcStreak(habit.id, completions)}
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

        {advice && <p className="daily-advice">&ldquo;{advice}&rdquo;</p>}
      </div>
    </div>
  )
}
