import { createHandler } from '@autonoma-ai/server-web'
import { drizzleAdapter } from '@autonoma-ai/sdk-drizzle'
import { db } from '@/db'
import * as schema from '@/db/schema'

export const POST = createHandler({
  adapter: drizzleAdapter(db, schema, { scopeField: 'organizationId' }),
  sharedSecret: process.env.AUTONOMA_SHARED_SECRET ?? 'my-shared-secret',
  signingSecret: process.env.AUTONOMA_SIGNING_SECRET ?? 'my-signing-secret',
})
