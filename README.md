# Autonoma SDK — Next.js + Drizzle Task Manager

A multi-tenant task management app built with Next.js, Drizzle ORM, Tailwind CSS, and the Autonoma SDK. Ready to deploy on Vercel.

## Features

- **Multi-tenant**: Organizations scope all data (users, projects, tasks)
- **Task board**: Kanban-style columns (To Do, In Progress, Done)
- **Autonoma SDK**: Environment Factory endpoint for automated test data provisioning

## Prerequisites

- Node.js 18+
- PostgreSQL (Docker or managed, e.g. Vercel Postgres / Neon)

## Quick start

### 1. Start PostgreSQL

```bash
docker run --rm -d \
  --name autonoma-postgres \
  -e POSTGRES_USER=autonoma \
  -e POSTGRES_PASSWORD=autonoma \
  -e POSTGRES_DB=autonoma_example \
  -p 5432:5432 \
  postgres:16-alpine
```

### 2. Install & set up

```bash
cp .env.example .env
npm install
npm run db:push
npm run dev
```

The app is at http://localhost:3000.

### 3. Test the Autonoma endpoint

```bash
BODY='{"action":"discover"}'
SIGNATURE=$(echo -n "$BODY" | openssl dgst -sha256 -hmac "my-shared-secret" | awk '{print $2}')

curl -X POST http://localhost:3000/api/autonoma \
  -H "Content-Type: application/json" \
  -H "x-signature: $SIGNATURE" \
  -d "$BODY"
```

## Deploy to Vercel

1. Push this directory to a GitHub repo
2. Import in Vercel
3. Add a Postgres database (Vercel Postgres or Neon integration)
4. Set environment variables:
   - `DATABASE_URL` — your Postgres connection string
   - `AUTONOMA_SHARED_SECRET` — shared secret for Autonoma
   - `AUTONOMA_SIGNING_SECRET` — private signing secret
5. Run `npm run db:push` against the production database (or use Drizzle migrations)

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/autonoma` | Autonoma Environment Factory (discover/up/down) |
| GET/POST | `/api/organizations` | List / create organizations |
| GET/DELETE | `/api/organizations/:orgId` | Get / delete organization |
| GET/POST | `/api/organizations/:orgId/users` | List / create users |
| DELETE | `/api/organizations/:orgId/users/:userId` | Delete user |
| GET/POST | `/api/organizations/:orgId/projects` | List / create projects |
| GET/DELETE | `/api/organizations/:orgId/projects/:projectId` | Get / delete project |
| GET/POST | `/api/organizations/:orgId/projects/:projectId/tasks` | List / create tasks |
| PATCH/DELETE | `/api/organizations/:orgId/projects/:projectId/tasks/:taskId` | Update / delete task |

## Project structure

```
src/
  app/
    page.tsx                      # Organizations list (home)
    [orgId]/
      page.tsx                    # Projects & users for an org
      projects/[projectId]/
        page.tsx                  # Task board (kanban)
    api/
      autonoma/route.ts           # Autonoma SDK endpoint
      organizations/              # CRUD routes
  db/
    schema.ts                     # Drizzle schema (organizations, users, projects, tasks)
    index.ts                      # Drizzle client
```
