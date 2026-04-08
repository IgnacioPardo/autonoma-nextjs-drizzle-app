import { NextResponse } from 'next/server'
import { db } from '@/db'
import { organizations } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params
  const [org] = await db.select().from(organizations).where(eq(organizations.id, orgId))
  if (!org) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(org)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params
  await db.delete(organizations).where(eq(organizations.id, orgId))
  return NextResponse.json({ ok: true })
}
