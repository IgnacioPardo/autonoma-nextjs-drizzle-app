import { NextResponse } from 'next/server'
import { db } from '@/db'
import { organizations } from '@/db/schema'

export async function GET() {
  const rows = await db.select().from(organizations).orderBy(organizations.createdAt)
  return NextResponse.json(rows)
}

export async function POST(req: Request) {
  const body = await req.json()
  const [org] = await db.insert(organizations).values({ name: body.name }).returning()
  return NextResponse.json(org, { status: 201 })
}
