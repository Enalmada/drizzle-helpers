---
title: ORM
description: A guide how to use this module.
---

- criteria builder
- create/update methods assume returning one and shift for cleaner service code
- pagination support for offset
- order by support

See DrizzleOrm.ts for code.

## Usage
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