# Drizzle Helpers

This package was created to share some common db code and patterns between many projects. Features, enhancements, and bug fixes
can be DRY.

### Migration script: migrate/index.ts

requires

- process.env.DATABASE_URL - although best practice is to not use process in a module, it was just most practical for MVP.  Referring to 
drizzle config file value would be ideal.
- modules `drizzle-orm/postgres-js` and `postgres`. See Dockerfile and entrypoint.sh for examples of how it could be used in production

usage
`node node_modules/@enalmada/drizzle-helpers/dist/migrate <migration directory>`

example
```
// package.json
  "drizzle:migrate": "dotenv -e ./.env.local node node_modules/@enalmada/drizzle-helpers/dist/migrate ./src/server/db/migrations",
  "drizzle:migrate:prod": "node node_modules/@enalmada/drizzle-helpers/dist/migrate ./src/server/db/migrations",
```

### Connection

- optimized for next.js dev reloading to avoid connection limits (reuse initialization)
  see [DrizzleConnect.ts](https://github.com/Enalmada/drizzle-helpers/blob/main/src/DrizzleConnect.ts) for code.  

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

### ORM

- criteria builder
- create/update methods assume returning one and shift for cleaner service code
- pagination support for offset
- order by support
  see DrizzleOrm.ts for more.

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
[ ] get DATABASE_URL from drizzle config rather than env