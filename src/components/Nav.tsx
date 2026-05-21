'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { signOut } from '@/app/auth/actions'

export default function Nav() {
  const pathname = usePathname()
  if (pathname === '/auth') return null
  return (
    <nav className="top-nav">
      <Link href="/" className={`top-nav-link${pathname === '/' ? ' active' : ''}`}>
        <span className="top-nav-icon">✓</span>
        <span>Habits</span>
      </Link>
      <Link href="/stats" className={`top-nav-link${pathname === '/stats' ? ' active' : ''}`}>
        <span className="top-nav-icon">📊</span>
        <span>Stats</span>
      </Link>
      <form action={signOut}>
        <button type="submit" className="top-nav-link">
          <span className="top-nav-icon">↩</span>
          <span>Sign out</span>
        </button>
      </form>
    </nav>
  )
}
