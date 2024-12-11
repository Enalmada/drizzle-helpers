// src/migrate/migrate.ts
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
var databaseConfig = {
  RETRY_INTERVAL: process.env.DB_RETRY_INTERVAL ? Number.parseInt(process.env.DB_RETRY_INTERVAL) : 1000,
  MAX_RETRIES: process.env.DB_MAX_RETRIES ? Number.parseInt(process.env.DB_MAX_RETRIES) : 10
};
var waitUntilDatabaseIsReady = async (sql) => {
  for (let attempts = 0;attempts < databaseConfig.MAX_RETRIES; attempts++) {
    try {
      await sql`SELECT 1`;
      return;
    } catch (err) {
      if (attempts === 0) {
        console.log(`⏳ Database not ready. Retrying every ${databaseConfig.RETRY_INTERVAL / 1000}s...`);
      } else if (attempts === databaseConfig.MAX_RETRIES - 1) {
        throw new Error("⏳ Database not ready after maximum retries");
      }
      await new Promise((resolve) => setTimeout(resolve, databaseConfig.RETRY_INTERVAL));
    }
  }
};
var runMigrate = async (migrationsFolder) => {
  if (!migrationsFolder) {
    throw new Error("Migrations folder not provided");
  }
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is not defined");
  }
  const sql = postgres(process.env.DATABASE_URL, { max: 1 });
  const db = drizzle(sql);
  try {
    console.log("⏳ Waiting for database to be ready...");
    await waitUntilDatabaseIsReady(sql);
    console.log("⏳ Running migrations...");
    const start = Date.now();
    await migrate(db, { migrationsFolder });
    const end = Date.now();
    console.log(`✅ Migrations completed in ${end - start}ms`);
  } catch (err) {
    console.error("❌ Migration failed", err);
    throw err;
  } finally {
    await sql.end();
  }
};
export {
  waitUntilDatabaseIsReady,
  runMigrate,
  databaseConfig
};
