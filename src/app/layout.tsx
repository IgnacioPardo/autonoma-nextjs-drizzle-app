import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Task Manager — Autonoma SDK Example',
  description: 'Multi-tenant task management app built with Next.js, Drizzle, and the Autonoma SDK',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <header className="bg-white border-b px-6 py-3 flex items-center justify-between">
          <a href="/" className="text-lg font-semibold">Task Manager</a>
          <span className="text-xs text-gray-400">Powered by Autonoma SDK</span>
        </header>
        <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
      </body>
    </html>
  )
}
