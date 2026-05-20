'use client'
import { useActionState } from 'react'
import { authenticate } from './actions'

export default function AuthForm() {
  const [state, formAction] = useActionState(authenticate, null)

  return (
    <form action={formAction} className="auth-form">
      <label htmlFor="email">Email</label>
      <input id="email" name="email" type="email" required />

      <label htmlFor="password">Password</label>
      <input id="password" name="password" type="password" required />

      <button type="submit">Continue</button>

      {state?.error && <p className="auth-error">{state.error}</p>}
      {state?.message && <p className="auth-message">{state.message}</p>}
    </form>
  )
}
