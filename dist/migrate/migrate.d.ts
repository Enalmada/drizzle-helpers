export declare const databaseConfig: {
    RETRY_INTERVAL: number;
    MAX_RETRIES: number;
};
export declare const waitUntilDatabaseIsReady: (sql: any) => Promise<void>;
export declare const runMigrate: (migrationsFolder?: string) => Promise<void>;
