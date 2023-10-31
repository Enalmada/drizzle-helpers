---
title: Migration Script
description: A guide how to use this module.
---

usage
`node node_modules/@enalmada/drizzle-helpers/dist/migrate/index.mjs <migration directory>`

process.env.DATABASE_URL (required) - although best practice is to not use process in a module, it was just most practical for MVP.  Referring to
drizzle config file value would be ideal.

optional
- process.env.MAX_RETRIES - default 10
- process.env.RETRY_INTERVAL in ms - default 1000 (check every second)


example
```
// package.json
  "drizzle:migrate": "dotenv -e ./.env.local node node_modules/@enalmada/drizzle-helpers/dist/migrate/index.mjs ./src/server/db/migrations",
  "drizzle:migrate:prod": "node node_modules/@enalmada/drizzle-helpers/dist/migrate/index.mjs ./src/server/db/migrations",
```

see [script](https://github.com/Enalmada/drizzle-helpers/blob/main/src/migrate/index.ts) source

### inspiration
https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/postgres-js/README.md#running-migrations
https://github.com/joschan21/drizzle-planetscale-starter/blob/master/src/app/page.tsx

### TODO
- [ ] figure out how to stop the expected `relation "__drizzle_migrations" already exists, skipping`
- [ ] log error when migration fails

### Notes
* modules `drizzle-orm/postgres-js` and `postgres` are bundled (next.js might be built in standalone without access to node_modules).
  See Dockerfile and entrypoint.sh for examples of how it could be used in production