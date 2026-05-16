import type { Metadata } from 'next'
import { PostHogProvider } from '@/components/PostHogProvider'
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
        </PostHogProvider>
      </body>
    </html>
  )
}
