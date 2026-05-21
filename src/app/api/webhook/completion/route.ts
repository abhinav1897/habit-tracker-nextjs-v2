import { NextResponse } from 'next/server'
import { Resend } from 'resend'
import { createClient } from '@supabase/supabase-js'

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(request: Request) {
  const payload = await request.json()

  if (payload.type !== 'INSERT') {
    return NextResponse.json({ ok: true })
  }

  const { habit_id, date } = payload.record

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  )

  const { data: habit } = await supabase
    .from('habits')
    .select('name, emoji')
    .eq('id', habit_id)
    .single()

  await resend.emails.send({
    from: 'onboarding@resend.dev',
    to: 'abhinav1897@gmail.com',
    subject: `Habit completed: ${habit?.emoji} ${habit?.name}`,
    html: `<p>You completed <strong>${habit?.emoji} ${habit?.name}</strong> on ${date}. Keep it up!</p>`,
  })

  return NextResponse.json({ ok: true })
}
