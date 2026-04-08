import { NextResponse } from 'next/server'
import { db } from '@/db'
import { projects } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: { orgId: string } }) {
  const rows = await db.select().from(projects).where(eq(projects.organizationId, params.orgId)).orderBy(projects.createdAt)
  return NextResponse.json(rows)
}

export async function POST(req: Request, { params }: { params: { orgId: string } }) {
  const body = await req.json()
  const [project] = await db.insert(projects).values({
    name: body.name,
    description: body.description ?? null,
    organizationId: params.orgId,
  }).returning()
  return NextResponse.json(project, { status: 201 })
}
