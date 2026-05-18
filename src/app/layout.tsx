import type { Metadata } from 'next'
import { PostHogProvider } from '@/components/PostHogProvider'
import Nav from '@/components/Nav'
import './globals.css'

export const metadata: Metadata = {
  title: 'Habit.',
  description: 'Track your daily habits',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <PostHogProvider>
          {children}
          <Nav />
        </PostHogProvider>
      </body>
    </html>
  )
}
