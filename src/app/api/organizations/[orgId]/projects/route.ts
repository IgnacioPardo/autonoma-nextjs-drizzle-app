import { NextResponse } from 'next/server'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params
  const rows = await db.select().from(projects).where(eq(projects.organizationId, orgId)).orderBy(projects.createdAt)
  return NextResponse.json(rows)
}

export async function POST(req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params
  const body = await req.json()
  const [project] = await db.insert(projects).values({
    name: body.name,
    description: body.description ?? null,
    organizationId: orgId,
  }).returning()
  return NextResponse.json(project, { status: 201 })
}
