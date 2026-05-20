import AuthForm from './AuthForm'

export default function AuthPage() {
  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Habit<span>.</span></h1>
        <p className="auth-subtitle">Sign in or create an account</p>
        <AuthForm />
      </div>
    </div>
  )
}
