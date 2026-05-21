import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { toggleHabitInStore } from '@/lib/store'
import { todayKey } from '@/lib/utils'

export async function POST(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await toggleHabitInStore(id, todayKey(), supabase)
  return NextResponse.json({ success: true })
}
