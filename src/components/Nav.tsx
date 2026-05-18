'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Nav() {
  const pathname = usePathname()
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
    </nav>
  )
}
