import { drizzle, type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

declare global {
  // global use requires var
  // eslint-disable-next-line no-var,@typescript-eslint/no-explicit-any
  var drizzleDbClient: PostgresJsDatabase<any> | undefined;
}

export interface DatabaseOptions<T> {
  nodeEnv: string;
  databaseUrl: string;
  schema: T;
}

// Function to connect to database
export function connectToDatabase<T extends Record<string, unknown>>(
  options: DatabaseOptions<T>
): PostgresJsDatabase<T> {
  const { nodeEnv, databaseUrl, schema } = options;

  if (nodeEnv === 'production') {
    // Directly create a new instance if in production
    const client = postgres(databaseUrl);
    return drizzle(client, { schema });
  } else {
    // Use global variable to store client if in development
    if (!globalThis.drizzleDbClient) {
      const client = postgres(databaseUrl);
      globalThis.drizzleDbClient = drizzle(client, { schema });
    }
    return globalThis.drizzleDbClient as PostgresJsDatabase<T>;
  }
}
