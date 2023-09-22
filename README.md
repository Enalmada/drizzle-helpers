# Drizzle Helpers

This package was created to share some common db code and patterns between many projects. Features, enhancements, and bug fixes
can be DRY.

### Migration script: migrate/index.ts

requires

- process.env.DATABASE_URL
- modules `drizzle-orm/postgres-js` and `postgres`. See Dockerfile and entrypoint.sh for examples of how it could be used in production

example package.json script:

```
  "drizzle:migrate": "dotenv -e ./.env.local node node_modules/drizzle-helpers/dist/migrate ./src/server/db/migrations",
  "drizzle:migrate:prod": "node node_modules/drizzle-helpers/dist/migrate ./src/server/db/migrations",
```

### Connection

- optimized for next.js dev reloading to avoid connection limits (reuse initialization)
  see DrizzleConnect.ts for code.

## ORM

- criteria builder
- create/update methods assume returning one and shift for cleaner service code
- pagination support for offset
- order by support
  see DrizzleOrm.ts for more.
