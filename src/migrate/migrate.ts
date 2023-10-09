/* eslint-disable @typescript-eslint/no-explicit-any,no-console */
// https://github.com/drizzle-team/drizzle-orm/blob/main/drizzle-orm/src/postgres-js/README.md
// https://github.com/joschan21/drizzle-planetscale-starter/blob/master/src/app/page.tsx

import { drizzle } from 'drizzle-orm/postgres-js';
import { migrate } from 'drizzle-orm/postgres-js/migrator';
import postgres from 'postgres';

export const databaseConfig = {
  RETRY_INTERVAL: process.env.DB_RETRY_INTERVAL ? parseInt(process.env.DB_RETRY_INTERVAL) : 1000,
  MAX_RETRIES: process.env.DB_MAX_RETRIES ? parseInt(process.env.DB_MAX_RETRIES) : 10,
};

export const waitUntilDatabaseIsReady = async (sql: any): Promise<void> => {
  for (let attempts = 0; attempts < databaseConfig.MAX_RETRIES; attempts++) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await sql`SELECT 1`;
      return;
    } catch (err) {
      if (attempts === 0) {
        console.log(
          `⏳ Database not ready. Retrying every ${databaseConfig.RETRY_INTERVAL / 1000}s...`
        );
      } else if (attempts === databaseConfig.MAX_RETRIES - 1) {
        throw new Error('⏳ Database not ready after maximum retries');
      }
      await new Promise((resolve) => setTimeout(resolve, databaseConfig.RETRY_INTERVAL));
    }
  }
};

export const runMigrate = async (migrationsFolder?: string): Promise<void> => {
  if (!migrationsFolder) {
    throw new Error('Migrations folder not provided');
  }

  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined');
  }

  const sql = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(sql);

  try {
    console.log('⏳ Waiting for database to be ready...');
    await waitUntilDatabaseIsReady(sql);

    console.log('⏳ Running migrations...');
    const start = Date.now();
    await migrate(db, { migrationsFolder });
    const end = Date.now();
    console.log(`✅ Migrations completed in ${end - start}ms`);
  } catch (err) {
    console.error('❌ Migration failed', err);
    throw err; // Let the error bubble up, so it can be caught and handled by the caller.
  } finally {
    await sql.end();
  }
};
