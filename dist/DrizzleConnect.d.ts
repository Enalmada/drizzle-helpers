import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
declare global {
    var drizzleDbClient: PostgresJsDatabase<any> | undefined;
}
export interface DatabaseOptions<T> {
    nodeEnv: string;
    databaseUrl: string;
    schema: T;
}
export declare function connectToDatabase<T extends Record<string, unknown>>(options: DatabaseOptions<T>): PostgresJsDatabase<T>;
