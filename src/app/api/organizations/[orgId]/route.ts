import { NextResponse } from 'next/server'
import { db } from '@/db'
import { organizations } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: { orgId: string } }) {
  const [org] = await db.select().from(organizations).where(eq(organizations.id, params.orgId))
  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(org)
}

export async function DELETE(_req: Request, { params }: { params: { orgId: string } }) {
  await db.delete(organizations).where(eq(organizations.id, params.orgId))
  return NextResponse.json({ ok: true })
}
