import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { getCompletions } from '@/lib/store'
import { calcStreak } from '@/lib/utils'

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const completions = await getCompletions(supabase)
  const streak = calcStreak(id, completions)
  return NextResponse.json({ habitId: id, streak })
}
