import { createHandler } from '@autonoma-ai/server-web'
import { pgExecutor } from '@autonoma-ai/sdk-pg'
import { pool } from '@/db'

export const POST = createHandler({
  executor: pgExecutor(pool),
  scopeField: 'organizationId',
  sharedSecret: process.env.AUTONOMA_SHARED_SECRET ?? 'my-shared-secret',
  signingSecret: process.env.AUTONOMA_SIGNING_SECRET ?? 'my-signing-secret',
  auth: () => ({}),
  allowProduction: true,
})
