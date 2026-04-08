import { drizzle } from 'drizzle-orm/node-postgres'
import pg from 'pg'
import * as schema from './schema'

const pool = new pg.Pool({
  connectionString: process.env.DATABASE_URL ?? 'postgresql://autonoma:autonoma@localhost:5432/autonoma_example',
})

export const db = drizzle(pool, { schema })
