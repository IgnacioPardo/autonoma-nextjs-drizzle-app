import { NextResponse } from 'next/server'
import { db } from '@/db'
import { tasks, users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const rows = await db
    .select({
      id: tasks.id,
      title: tasks.title,
      status: tasks.status,
      projectId: tasks.projectId,
      assigneeId: tasks.assigneeId,
      assigneeName: users.name,
      createdAt: tasks.createdAt,
    })
    .from(tasks)
    .leftJoin(users, eq(tasks.assigneeId, users.id))
    .where(eq(tasks.projectId, projectId))
    .orderBy(tasks.createdAt)
  return NextResponse.json(rows)
}

export async function POST(req: Request, { params }: { params: Promise<{ orgId: string; projectId: string }> }) {
  const { orgId, projectId } = await params
  const body = await req.json()
  const [task] = await db.insert(tasks).values({
    title: body.title,
    status: body.status ?? 'todo',
    organizationId: orgId,
    projectId: projectId,
    assigneeId: body.assigneeId,
  }).returning()
  return NextResponse.json(task, { status: 201 })
}
