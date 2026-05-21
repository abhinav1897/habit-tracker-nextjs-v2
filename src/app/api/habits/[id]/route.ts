import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { deleteHabitFromStore } from '@/lib/store'

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  await deleteHabitFromStore(id, supabase)
  return NextResponse.json({ success: true })
}
