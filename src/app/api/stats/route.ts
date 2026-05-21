import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getHabits, getCompletions } from '@/lib/store'
import { todayKey, calcStreak } from '@/lib/utils'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const habits = await getHabits(supabase)
  const completions = await getCompletions(supabase)
  const today = todayKey()
  const todayList = completions[today] ?? []
  const doneToday = habits.filter(h => todayList.includes(h.id)).length
  const pct = habits.length > 0 ? Math.round((doneToday / habits.length) * 100) : 0

  return NextResponse.json({
    totalHabits: habits.length,
    completedToday: doneToday,
    percentToday: pct,
    daysTracked: Object.keys(completions).length,
    habits: habits.map(habit => ({
      id: habit.id,
      name: habit.name,
      emoji: habit.emoji,
      streak: calcStreak(habit.id, completions),
      totalCompletions: Object.values(completions).filter(list => list.includes(habit.id)).length,
    })),
  })
}
