import { createHandler } from '@autonoma-ai/server-web'
import { drizzleExecutor } from '@autonoma-ai/sdk-drizzle'
import { db } from '@/db'

export const POST = createHandler({
  executor: drizzleExecutor(db),
  scopeField: 'organizationId',
  sharedSecret: process.env.AUTONOMA_SHARED_SECRET ?? 'my-shared-secret',
  signingSecret: process.env.AUTONOMA_SIGNING_SECRET ?? 'my-signing-secret',
})
