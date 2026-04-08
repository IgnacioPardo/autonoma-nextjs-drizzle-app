'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Org { id: string; name: string }

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const { orgId } = useParams<{ orgId: string }>()
  const [org, setOrg] = useState<Org | null>(null)

  useEffect(() => {
    fetch(`/api/organizations/${orgId}`).then(r => r.json()).then(setOrg)
  }, [orgId])

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-6">
        <a href="/" className="hover:text-blue-600">Organizations</a>
        <span>/</span>
        <span className="text-gray-900 font-medium">{org?.name ?? '...'}</span>
      </nav>

      <div className="flex gap-6 mb-8">
        <a href={`/${orgId}`} className="text-sm font-medium hover:text-blue-600">Projects</a>
        <a href={`/${orgId}?tab=users`} className="text-sm font-medium hover:text-blue-600">Users</a>
      </div>

      {children}
    </div>
  )
}
