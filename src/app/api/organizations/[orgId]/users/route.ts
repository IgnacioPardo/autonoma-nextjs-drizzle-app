import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params
  const rows = await db.select().from(users).where(eq(users.organizationId, orgId)).orderBy(users.createdAt)
  return NextResponse.json(rows)
}

export async function POST(req: Request, { params }: { params: Promise<{ orgId: string }> }) {
  const { orgId } = await params
  const body = await req.json()
  const [user] = await db.insert(users).values({
    name: body.name,
    email: body.email,
    organizationId: orgId,
  }).returning()
  return NextResponse.json(user, { status: 201 })
}
