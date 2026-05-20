'use server'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

type AuthState = { error?: string; message?: string } | null

export async function authenticate(
  prevState: AuthState,
  formData: FormData
): Promise<AuthState> {
  const supabase = await createClient()
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

  if (!signInError) {
    redirect('/')
  }

  if (signInError.message.toLowerCase().includes('email not confirmed')) {
    return { message: 'Please check your inbox and confirm your email before signing in.' }
  }

  if (signInError.message.toLowerCase().includes('invalid login credentials')) {
    const { data } = await supabase.auth.signUp({ email, password })

    if (data.user) {
      return { message: 'Account created! Check your inbox to confirm your email, then sign in.' }
    }

    return { error: 'Wrong email or password.' }
  }

  return { error: signInError.message }
}

export async function signOut(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/auth')
}
