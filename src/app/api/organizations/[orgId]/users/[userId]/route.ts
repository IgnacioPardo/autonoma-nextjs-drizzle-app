import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(_req: Request, { params }: { params: { userId: string } }) {
  await db.delete(users).where(eq(users.id, params.userId))
  return NextResponse.json({ ok: true })
}
