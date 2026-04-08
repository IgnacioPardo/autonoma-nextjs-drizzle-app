import { NextResponse } from 'next/server'
import { db } from '@/db'
import { users } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function DELETE(_req: Request, { params }: { params: Promise<{ userId: string }> }) {
  const { userId } = await params
  await db.delete(users).where(eq(users.id, userId))
  return NextResponse.json({ ok: true })
}
