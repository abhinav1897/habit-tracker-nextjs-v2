import { getHabits, getCompletions } from '@/lib/store'
import { todayKey, calcStreak } from '@/lib/utils'

export default function StatsPage() {
  const habits = getHabits()
  const completions = getCompletions()
  const today = todayKey()
  const todayList = completions[today] ?? []
  const doneToday = habits.filter(h => todayList.includes(h.id)).length
  const pct = habits.length > 0 ? Math.round((doneToday / habits.length) * 100) : 0
  const daysTracked = Object.keys(completions).length

  return (
    <div>
      <header>
        <h1>Stats<span>.</span></h1>
        <span className="date-label">
          {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
        </span>
      </header>

      <div className="main">
        <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-value">{habits.length}</div>
            <div className="stat-label">Total habits</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{pct}%</div>
            <div className="stat-label">Done today</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{daysTracked}</div>
            <div className="stat-label">Days tracked</div>
          </div>
        </div>

        {habits.length === 0 ? (
          <div className="empty-state">
            <div className="icon">📊</div>
            <p>No habits yet. Add some on the habits page to see your stats!</p>
          </div>
        ) : (
          <>
            <div className="section-title">Habit breakdown</div>
            <div className="stats-list">
              {habits.map(habit => {
                const streak = calcStreak(habit.id, completions)
                const total = Object.values(completions)
                  .filter(list => list.includes(habit.id)).length
                return (
                  <div key={habit.id} className="stat-row">
                    <span className="stat-row-name">
                      {habit.emoji} {habit.name}
                    </span>
                    <div className="stat-row-chips">
                      <span className="stat-chip">🔥 {streak} day streak</span>
                      <span className="stat-chip">✓ {total} total</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
