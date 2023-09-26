# Drizzle Helpers (for postgres)

The helpers has 3 components:
* migration script
* connection code
* ORM helpers

## Migration script
* validate input
* wait for db to be ready every second for 10s (although docker has returned "started" it may still take a moment)
* report status
* modules `drizzle-orm/postgres-js` and `postgres` are bundled (next.js might be built in standalone without access to node_modules). 
See Dockerfile and entrypoint.sh for examples of how it could be used in production

process.env.DATABASE_URL (required) - although best practice is to not use process in a module, it was just most practical for MVP.  Referring to 
drizzle config file value would be ideal.

optional
- process.env.MAX_RETRIES - default 10
- process.env.RETRY_INTERVAL in ms - default 1000 (check every second)

usage
`node node_modules/@enalmada/drizzle-helpers/dist/migrate/index.mjs <migration directory>`

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

## Connection
* Optimized for next.js dev reloading to avoid hot deploy connection limits 
See [prisma guide](https://www.prisma.io/docs/guides/performance-and-optimization/connection-management#prevent-hot-reloading-from-creating-new-instances-of-prismaclient) for more info on concept.

Usage
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

## ORM

- criteria builder
- create/update methods assume returning one and shift for cleaner service code
- pagination support for offset
- order by support
  
See DrizzleOrm.ts for code.

Usage
```ts
// task.repository.ts
import { db } from '@/server/db';
import { TaskTable, type Task, type TaskInput } from '@/server/db/schema';
import type * as schema from '@/server/db/schema';
import { createRepo } from '@enalmada/drizzle-helpers';

export const TaskRepository = createRepo<typeof schema, Task, TaskInput>(
        db,
        TaskTable,
        db.query.TaskTable
);

export default TaskRepository;

```

```ts
// task.service.ts
task(user: User, id: string, ctx: MyContextType) {
    
  const task = await TaskRepository.findFirst({ id });
  
  if (!task) {
    throw new NotFoundError(`task ${id} not found`, logger);
  }
  
  return task;
}
```

## TODO
- [ ] get DATABASE_URL from drizzle config rather than env
- [ ] add `findFirstOrThrow` to make code cleaner and be more [prisma like](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#findfirstorthrow)
- [ ] validate and example fetching relational child data 

## Build Notes
* Using [latest module and target settings](https://stackoverflow.com/questions/72380007/what-typescript-configuration-produces-output-closest-to-node-js-18-capabilities/72380008#72380008) for current LTS  
* using tsc for types until [bun support](https://github.com/oven-sh/bun/issues/5141#issuecomment-1727578701) comes around

## Contribute
Using [changesets](https://github.com/changesets/changesets) so please remember to run "changeset" with any PR