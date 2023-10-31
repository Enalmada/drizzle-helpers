---
title: Optimized Connection
description: A guide how to use this module.
---

Optimized for next.js dev reloading to avoid hot deploy connection limits
See [prisma guide](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient) for more info on concept.

## Usage
```ts
// db.ts
import { connectToDatabase } from '@enalmada/drizzle-helpers';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';

import * as schema from './schema';

export const db: PostgresJsDatabase<typeof schema> = connectToDatabase<typeof schema>({
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL!,
  schema: schema,
});
```

see [DrizzleConnect.ts](https://github.com/Enalmada/drizzle-helpers/blob/main/src/DrizzleConnect.ts) for source.

## TODO
- [ ] make PgDatabase parameter more generic so neon serverless can work too