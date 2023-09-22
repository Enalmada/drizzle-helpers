// https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/postgres-js/README.md
// https://github.com/joschan21/drizzle-planetscale-starter/blob/master/src/app/page.tsx
import 'dotenv/config';

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const runMigrate = async (migrationsFolder: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = postgres(process.env.DATABASE_URL, { max: 1 });

  const db = drizzle(sql);

  // eslint-disable-next-line no-console
  console.log('⏳ Running migrations...');

  const start = Date.now();

  await migrate(db, { migrationsFolder: migrationsFolder });

  const end = Date.now();

  // eslint-disable-next-line no-console
  console.log(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
};

runMigrate(process.argv[2]!).catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
