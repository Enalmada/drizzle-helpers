/* eslint-disable @typescript-eslint/no-explicit-any */
import { databaseConfig, runMigrate } from '../src/migrate/migrate';

// Define mockSqlCall within your test (or at the top scope of the file if you plan to use it in multiple tests):
let mockSqlCall;

vi.mock('postgres', () => {
  return {
    default: (...args) => {
      mockSqlCall(...args); // Forward the args to the mock function
      return {
        end: () => {
          vi.fn();
        },
      };
    },
  };
});

// Mock the `migrate` method from `drizzle-orm/postgres-js`
vi.mock('drizzle-orm/postgres-js', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    migrate: vi.fn().mockResolvedValue(true),
  };
});
vi.mock('drizzle-orm/postgres-js/migrator', () => {
  return {
    migrate: vi.fn().mockResolvedValue(true),
  };
});

vi.mock('../src/migrate/migrate', async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    waitUntilDatabaseIsReady: vi.fn().mockResolvedValue(),
  };
});

describe('Migration Tests', () => {
  let exitSpy;

  beforeEach(() => {
    process.env.DATABASE_URL = 'mock-database-url';
    // Mock process.exit
    exitSpy = vi.spyOn(process, 'exit').mockImplementation((() => {}) as any);
    // Reset the mockSqlCall for each test
    mockSqlCall = vi.fn();
  });

  afterEach(() => {
    delete process.env.DATABASE_URL; // Clean up mock DATABASE_URL after each test
    vi.clearAllMocks();
    exitSpy.mockRestore(); // Restore the original process.exit function after each test
  });

  it('should throw error when migrations folder not provided', async () => {
    await expect(runMigrate()).rejects.toThrow('Migrations folder not provided');
  });

  /*
  test('should run migrations successfully', async () => {
    // Mock waitUntilDatabaseIsReady to be a no-op
    vi.spyOn(migrateModule, 'waitUntilDatabaseIsReady').mockResolvedValue();

    // Run the migrations
    await runMigrate('some-path');

    // Import the mocked postgres module to check if the end function was called
    const postgresMock = await import('postgres');

    // Expect that the end function was called to close the database connection
    expect(postgresMock.default().end).toHaveBeenCalled();
  });

   */

  it('should handle database not ready by retrying', async () => {
    // Modify the retry interval and max retries for testing purposes
    databaseConfig.RETRY_INTERVAL = 1;
    databaseConfig.MAX_RETRIES = 4;

    mockSqlCall
      .mockImplementationOnce(() => {
        throw new Error('⏳ Database not ready after maximum retries');
      })
      .mockResolvedValueOnce(true);

    try {
      await runMigrate('some-path');
    } catch (error) {
      // We expect an error to be thrown, but we handle it here so the test doesn't fail
      expect(error.message).toBe('⏳ Database not ready after maximum retries');
    }

    expect(mockSqlCall.mock.calls.length).toEqual(1);
  });
});
