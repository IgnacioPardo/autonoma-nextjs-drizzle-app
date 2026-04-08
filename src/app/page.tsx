'use client'

import { useEffect, useState } from 'react'

interface Org {
  id: string
  name: string
  createdAt: string
}

export default function Home() {
  const [orgs, setOrgs] = useState<Org[]>([])
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchOrgs = async () => {
    const res = await fetch('/api/organizations')
    setOrgs(await res.json())
    setLoading(false)
  }

  useEffect(() => { fetchOrgs() }, [])

  const createOrg = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim()) return
    await fetch('/api/organizations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: name.trim() }),
    })
    setName('')
    fetchOrgs()
  }

  const deleteOrg = async (id: string) => {
    await fetch(`/api/organizations/${id}`, { method: 'DELETE' })
    fetchOrgs()
  }

  if (loading) return <p className="text-gray-500">Loading...</p>

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Organizations</h1>

      <form onSubmit={createOrg} className="flex gap-2 mb-8">
        <input
          value={name}
          onChange={e => setName(e.target.value)}
          placeholder="New organization name"
          className="border rounded px-3 py-2 flex-1"
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Create
        </button>
      </form>

      {orgs.length === 0 ? (
        <p className="text-gray-500">No organizations yet. Create one to get started.</p>
      ) : (
        <ul className="space-y-2">
          {orgs.map(org => (
            <li key={org.id} className="bg-white border rounded p-4 flex items-center justify-between">
              <a href={`/${org.id}`} className="font-medium hover:text-blue-600">{org.name}</a>
              <button onClick={() => deleteOrg(org.id)} className="text-sm text-red-500 hover:text-red-700">
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
