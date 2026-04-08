'use client'

import { useEffect, useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'

interface Project { id: string; name: string; description: string | null; createdAt: string }
interface User { id: string; name: string; email: string; createdAt: string }

export default function OrgPage() {
  const { orgId } = useParams<{ orgId: string }>()
  const searchParams = useSearchParams()
  const tab = searchParams.get('tab') ?? 'projects'

  const [projects, setProjects] = useState<Project[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [projectName, setProjectName] = useState('')
  const [projectDesc, setProjectDesc] = useState('')
  const [userName, setUserName] = useState('')
  const [userEmail, setUserEmail] = useState('')

  const fetchProjects = () => fetch(`/api/organizations/${orgId}/projects`).then(r => r.json()).then(setProjects)
  const fetchUsers = () => fetch(`/api/organizations/${orgId}/users`).then(r => r.json()).then(setUsers)

  useEffect(() => { fetchProjects(); fetchUsers() }, [orgId])

  const createProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!projectName.trim()) return
    await fetch(`/api/organizations/${orgId}/projects`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: projectName.trim(), description: projectDesc.trim() || null }),
    })
    setProjectName('')
    setProjectDesc('')
    fetchProjects()
  }

  const createUser = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!userName.trim() || !userEmail.trim()) return
    await fetch(`/api/organizations/${orgId}/users`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: userName.trim(), email: userEmail.trim() }),
    })
    setUserName('')
    setUserEmail('')
    fetchUsers()
  }

  const deleteUser = async (id: string) => {
    await fetch(`/api/organizations/${orgId}/users/${id}`, { method: 'DELETE' })
    fetchUsers()
  }

  if (tab === 'users') {
    return (
      <div>
        <h2 className="text-xl font-bold mb-4">Users</h2>
        <form onSubmit={createUser} className="flex gap-2 mb-6">
          <input value={userName} onChange={e => setUserName(e.target.value)} placeholder="Name" className="border rounded px-3 py-2 flex-1" />
          <input value={userEmail} onChange={e => setUserEmail(e.target.value)} placeholder="Email" className="border rounded px-3 py-2 flex-1" />
          <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add</button>
        </form>
        {users.length === 0 ? (
          <p className="text-gray-500">No users yet.</p>
        ) : (
          <ul className="space-y-2">
            {users.map(u => (
              <li key={u.id} className="bg-white border rounded p-3 flex items-center justify-between">
                <div>
                  <span className="font-medium">{u.name}</span>
                  <span className="text-gray-400 ml-2 text-sm">{u.email}</span>
                </div>
                <button onClick={() => deleteUser(u.id)} className="text-sm text-red-500 hover:text-red-700">Remove</button>
              </li>
            ))}
          </ul>
        )}
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Projects</h2>
      <form onSubmit={createProject} className="flex gap-2 mb-6">
        <input value={projectName} onChange={e => setProjectName(e.target.value)} placeholder="Project name" className="border rounded px-3 py-2 flex-1" />
        <input value={projectDesc} onChange={e => setProjectDesc(e.target.value)} placeholder="Description (optional)" className="border rounded px-3 py-2 flex-1" />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Create</button>
      </form>
      {projects.length === 0 ? (
        <p className="text-gray-500">No projects yet.</p>
      ) : (
        <ul className="space-y-2">
          {projects.map(p => (
            <li key={p.id} className="bg-white border rounded p-4">
              <a href={`/${orgId}/projects/${p.id}`} className="font-medium hover:text-blue-600">{p.name}</a>
              {p.description && <p className="text-sm text-gray-500 mt-1">{p.description}</p>}
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
