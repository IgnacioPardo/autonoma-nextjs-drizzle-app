import { NextResponse } from 'next/server'
import { db } from '@/db'
import { tasks } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function PATCH(req: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  const body = await req.json()
  const updates: Record<string, unknown> = {}
  if (body.title !== undefined) updates.title = body.title
  if (body.status !== undefined) updates.status = body.status
  if (body.deadline !== undefined) updates.deadline = new Date(body.deadline)
  if (body.assigneeId !== undefined) updates.assigneeId = body.assigneeId

  const [task] = await db.update(tasks).set(updates).where(eq(tasks.id, taskId)).returning()
  if (!task) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(task)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ taskId: string }> }) {
  const { taskId } = await params
  await db.delete(tasks).where(eq(tasks.id, taskId))
  return NextResponse.json({ ok: true })
}
