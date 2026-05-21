'use client'
import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'

export default function HabitRealtimeListener() {
  useEffect(() => {
    const supabase = createClient()
    let channel: ReturnType<typeof supabase.channel>

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) supabase.realtime.setAuth(session.access_token)

      channel = supabase
        .channel('habits-inserts')
        .on(
          'postgres_changes',
          { event: 'INSERT', schema: 'public', table: 'habits' },
          (payload) => {
            toast.success(`"${payload.new.name}" added!`)
          }
        )
        .subscribe()
    })

    return () => {
      if (channel) supabase.removeChannel(channel)
    }
  }, [])

  return null
}
