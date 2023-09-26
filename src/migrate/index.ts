// https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/postgres-js/README.md
// https://github.com/joschan21/drizzle-planetscale-starter/blob/master/src/app/page.tsx

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

const MAX_RETRIES = 10; // Maximum number of connection attempts
const RETRY_INTERVAL = 1000; // Time to wait between retries in milliseconds

const waitUntilDatabaseIsReady = async (sql: any) => {
  let attempts = 0;
  while (attempts < MAX_RETRIES) {
    try {
      // Try to make a query to check if the database is ready
      await sql`SELECT 1`;
      // If successful, break out of the loop
      return;
    } catch (err) {
      // If an error occurs, wait for the retry interval, and try again
      if (attempts === 0) {
        console.log(`⏳ Database not ready. Retrying every ${RETRY_INTERVAL / 1000}s...`);
      }
      if (attempts === MAX_RETRIES - 1) {
        // If maximum retries reached, throw an error
        throw new Error('⏳ Database not ready after maximum retries');
      }
      await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
      attempts++;
    }
  }
};

const runMigrate = async (migrationsFolder: string) => {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = postgres(process.env.DATABASE_URL, { max: 1 });

  // Wait until the database is ready before running migrations
  await waitUntilDatabaseIsReady(sql);

  const db = drizzle(sql);

  console.log('⏳ Running migrations...');

  const start = Date.now();

  await migrate(db, { migrationsFolder: migrationsFolder });

  const end = Date.now();

  console.log(`✅ Migrations completed in ${end - start}ms`);

  process.exit(0);
};

runMigrate(process.argv[2]!).catch((err) => {
  console.error('❌ Migration failed');
  console.error(err);
  process.exit(1);
});
