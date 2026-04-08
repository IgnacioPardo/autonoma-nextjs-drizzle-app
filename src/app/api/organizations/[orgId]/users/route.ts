import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function GET(_req: Request, { params }: { params: { orgId: string } }) {
  const rows = await db.select().from(users).where(eq(users.organizationId, params.orgId)).orderBy(users.createdAt)
  return NextResponse.json(rows)
}

export async function POST(req: Request, { params }: { params: { orgId: string } }) {
  const body = await req.json()
  const [user] = await db.insert(users).values({
    name: body.name,
    email: body.email,
    organizationId: params.orgId,
  }).returning()
  return NextResponse.json(user, { status: 201 })
}
