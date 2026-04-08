import { NextResponse } from 'next/server'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  const [project] = await db.select().from(projects).where(eq(projects.id, projectId))
  if (!project) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(project)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ projectId: string }> }) {
  const { projectId } = await params
  await db.delete(projects).where(eq(projects.id, projectId))
  return NextResponse.json({ ok: true })
}
