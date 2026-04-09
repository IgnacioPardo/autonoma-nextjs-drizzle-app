'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

interface Task {
  id: string
  title: string
  status: string
  deadline: string
  assigneeId: string
  assigneeName: string | null
  createdAt: string
}
interface User { id: string; name: string; email: string }
interface Project { id: string; name: string; description: string | null }

const STATUS_COLS = ['todo', 'in_progress', 'done'] as const
const STATUS_LABELS: Record<string, string> = { todo: 'To Do', in_progress: 'In Progress', done: 'Done' }
const STATUS_COLORS: Record<string, string> = {
  todo: 'bg-gray-100',
  in_progress: 'bg-yellow-50',
  done: 'bg-green-50',
}

export default function ProjectPage() {
  const { orgId, projectId } = useParams<{ orgId: string; projectId: string }>()
  const [project, setProject] = useState<Project | null>(null)
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [title, setTitle] = useState('')
  const [deadline, setDeadline] = useState('')
  const [assigneeId, setAssigneeId] = useState('')

  const apiBase = `/api/organizations/${orgId}/projects/${projectId}`

  const fetchAll = () => {
    fetch(`${apiBase}`).then(r => r.json()).then(setProject)
    fetch(`${apiBase}/tasks`).then(r => r.json()).then(setTasks)
    fetch(`/api/organizations/${orgId}/users`).then(r => r.json()).then(setUsers)
  }

  useEffect(fetchAll, [orgId, projectId])

  const createTask = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim() || !assigneeId || !deadline) return
    await fetch(`${apiBase}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: title.trim(), deadline, assigneeId }),
    })
    setTitle('')
    setDeadline('')
    setAssigneeId('')
    fetchAll()
  }

  const updateStatus = async (taskId: string, status: string) => {
    await fetch(`${apiBase}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchAll()
  }

  const deleteTask = async (taskId: string) => {
    await fetch(`${apiBase}/tasks/${taskId}`, { method: 'DELETE' })
    fetchAll()
  }

  return (
    <div>
      <nav className="flex items-center gap-2 text-sm text-gray-500 mb-2">
        <a href={`/${orgId}`} className="hover:text-blue-600">Projects</a>
        <span>/</span>
        <span className="text-gray-900 font-medium">{project?.name ?? '...'}</span>
      </nav>
      {project?.description && <p className="text-sm text-gray-500 mb-6">{project.description}</p>}

      <form onSubmit={createTask} className="flex gap-2 mb-8">
        <input value={title} onChange={e => setTitle(e.target.value)} placeholder="New task title" className="border rounded px-3 py-2 flex-1" />
        <input type="date" value={deadline} onChange={e => setDeadline(e.target.value)} min={new Date().toISOString().split('T')[0]} className="border rounded px-3 py-2" />
        <select value={assigneeId} onChange={e => setAssigneeId(e.target.value)} className="border rounded px-3 py-2">
          <option value="">Assign to...</option>
          {users.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
        </select>
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Add Task</button>
      </form>

      <div className="grid grid-cols-3 gap-4">
        {STATUS_COLS.map(status => (
          <div key={status} className={`rounded-lg p-4 ${STATUS_COLORS[status]}`}>
            <h3 className="font-semibold text-sm mb-3">{STATUS_LABELS[status]}</h3>
            <ul className="space-y-2">
              {tasks.filter(t => t.status === status).map(task => (
                <li key={task.id} className="bg-white border rounded p-3 shadow-sm">
                  <p className="font-medium text-sm">{task.title}</p>
                  <p className="text-xs text-gray-400 mt-1">Due: {new Date(task.deadline).toLocaleDateString()}</p>
                  <p className="text-xs text-gray-400">{task.assigneeName ?? 'Unassigned'}</p>
                  <div className="flex gap-1 mt-2">
                    {STATUS_COLS.filter(s => s !== status).map(s => (
                      <button key={s} onClick={() => updateStatus(task.id, s)} className="text-xs px-2 py-0.5 rounded bg-gray-100 hover:bg-gray-200">
                        {STATUS_LABELS[s]}
                      </button>
                    ))}
                    <button onClick={() => deleteTask(task.id)} className="text-xs px-2 py-0.5 rounded text-red-500 hover:bg-red-50 ml-auto">
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
