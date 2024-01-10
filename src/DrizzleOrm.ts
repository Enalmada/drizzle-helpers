/* eslint-disable @typescript-eslint/no-explicit-any,@typescript-eslint/ban-ts-comment */
import { and, asc, desc, eq } from 'drizzle-orm';
import { type PgTableWithColumns } from 'drizzle-orm/pg-core';
import { type RelationalQueryBuilder } from 'drizzle-orm/pg-core/query-builders/query';
import { type PostgresJsDatabase } from 'drizzle-orm/postgres-js';
import { type KnownKeysOnly } from 'drizzle-orm/utils';

type CriteriaType<T> = keyof T;

const buildWhereClause = <T>(table: PgTableWithColumns<any>, criteria?: Partial<T>) => {
  const conditions = criteria
    ? Object.keys(criteria)
        .filter((key) => criteria[key as CriteriaType<T>] !== undefined)
        .map((key) => {
          const criteriaType = key as CriteriaType<T>;
          return eq(table[criteriaType], criteria[criteriaType]!);
        })
    : [];

  if (conditions.length === 1) {
    return conditions[0];
  } else {
    return and(...conditions);
  }
};

export interface OrderBy {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const buildOrderByClause = <T>(table: PgTableWithColumns<any>, order?: OrderBy) => {
  if (!order) return;

  if (order.sortOrder === 'asc') {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return [asc(table[order.sortBy])];
  } else {
    // @ts-ignore
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return [desc(table[order.sortBy])];
  }
};

export interface Paging {
  page: number;
  pageSize: number;
}

export interface Config<T> extends KnownKeysOnly<any, any> {
  criteria?: Partial<T>;
  order?: OrderBy;
  paging?: Paging;
  limit?: number;
  offset?: number;
  with?: Record<string, any>;
}

export interface Page<T> {
  result: T[];
  hasMore: boolean;
}

const DEFAULT_PAGE_SIZE = 20;

export interface IRepository<T, TI> {
  findFirst(criteria: Partial<T>, config?: Config<T>): Promise<T>;
  findMany(config?: Config<T>): Promise<T[]>;
  findPage(config?: Config<T>): Promise<Page<T>>;
  create(createWith: TI): Promise<T>;
  update(id: string, updateWith: TI): Promise<T>;
  delete(id: string): Promise<T>;
}

export const createRepo = <
  TSchema extends Record<string, unknown>,
  T extends { [key: string]: any },
  TI extends { [key: string]: any },
>(
  db: PostgresJsDatabase<TSchema>, // replace with the appropriate type for db
  table: PgTableWithColumns<any>,
  queryBuilder: RelationalQueryBuilder<T, any>
): IRepository<T, TI> => {
  const queryMany = async (
    table: PgTableWithColumns<any>,
    queryBuilder: RelationalQueryBuilder<T, any>,
    config?: Config<T>
  ): Promise<T[]> => {
    const where = buildWhereClause(table, config?.criteria);
    const orderBy = buildOrderByClause(table, config?.order);

    return queryBuilder.findMany({
      where,
      orderBy,
      limit: config?.limit,
      offset: config?.offset,
      with: config?.with,
    }) as unknown as Promise<T[]>;
  };

  return {
    findFirst: async (criteria: Partial<T>, config?: Config<T>): Promise<T> => {
      const where = buildWhereClause(table, criteria);
      return queryBuilder.findFirst({ where, with: config?.with }) as unknown as Promise<T>;
    },
    findMany: async (config?: Config<T>): Promise<T[]> => {
      return queryMany(table, queryBuilder, config);
    },
    findPage: async (config?: Config<T>): Promise<Page<T>> => {
      const pageSize = config?.paging?.pageSize || DEFAULT_PAGE_SIZE;

      // Convert to 0-based index for internal calculations.
      const currentPage = (config?.paging?.page || 1) - 1;

      // Calculate limit and offset based on page and pageSize.
      const limit = pageSize + 1; // Add 1 to check for additional items
      const offset = currentPage * pageSize;

      const rawResult = await queryMany(table, queryBuilder, {
        ...config,
        limit,
        offset,
      });

      // Check if there are more items and slice the result array if needed.
      const hasMore = rawResult.length > pageSize;
      const result: T[] = hasMore ? rawResult.slice(0, -1) : rawResult;

      return {
        result,
        hasMore,
      };
    },
    create: async (createWith: TI): Promise<T> => {
      const inserted = await db.insert(table).values(createWith).returning();
      return inserted.shift()! as T;
    },
    update: async (id: string, updateWith: TI): Promise<T> => {
      const updated = await db.update(table).set(updateWith).where(eq(table.id, id)).returning();
      return updated.shift()! as T;
    },
    delete: async (id: string): Promise<T> => {
      const deleteResult = await db.delete(table).where(eq(table.id, id)).returning();
      return deleteResult.shift()! as T;
    },
  };
};
