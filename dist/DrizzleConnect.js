// src/DrizzleConnect.ts
import {drizzle} from "drizzle-orm/postgres-js";
import postgres from "postgres";
function connectToDatabase(options) {
  const { nodeEnv, databaseUrl, schema } = options;
  if (nodeEnv === "production") {
    const client = postgres(databaseUrl);
    return drizzle(client, { schema });
  } else {
    if (!globalThis.drizzleDbClient) {
      const client = postgres(databaseUrl);
      globalThis.drizzleDbClient = drizzle(client, { schema });
    }
    return globalThis.drizzleDbClient;
  }
}
export {
  connectToDatabase
};
