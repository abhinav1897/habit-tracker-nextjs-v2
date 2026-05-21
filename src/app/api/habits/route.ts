import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getHabits, addHabitToStore } from '@/lib/store'
import { todayKey } from '@/lib/utils'
import type { Habit } from '@/types'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const habits = await getHabits(supabase)
  return NextResponse.json({ habits })
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const body = await request.json()
  const { name, emoji } = body

  if (!name || !emoji) {
    return NextResponse.json({ error: 'name and emoji are required' }, { status: 400 })
  }

  const habit: Habit = { id: Date.now().toString(), name, emoji, createdAt: todayKey() }
  await addHabitToStore(habit, user.id, supabase)
  return NextResponse.json({ habit }, { status: 201 })
}
