// src/DrizzleOrm.tst.ts
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

// src/DrizzleOrm.ts
import {and, asc, desc, eq} from "drizzle-orm";
var buildWhereClause = (table, criteria) => {
  const conditions = criteria ? Object.keys(criteria).filter((key) => criteria[key] !== undefined).map((key) => {
    const criteriaType = key;
    return eq(table[criteriaType], criteria[criteriaType]);
  }) : [];
  if (conditions.length === 1) {
    return conditions[0];
  } else {
    return and(...conditions);
  }
};
var buildOrderByClause = (table, order) => {
  if (!order)
    return;
  if (order.sortOrder === "asc") {
    return [asc(table[order.sortBy])];
  } else {
    return [desc(table[order.sortBy])];
  }
};
var DEFAULT_PAGE_SIZE = 20;
var createRepo = (db, table, queryBuilder) => {
  const queryMany = async (table2, queryBuilder2, config) => {
    const where = buildWhereClause(table2, config?.criteria);
    const orderBy = buildOrderByClause(table2, config?.order);
    return queryBuilder2.findMany({
      where,
      orderBy,
      limit: config?.limit,
      offset: config?.offset
    });
  };
  return {
    findFirst: async (criteria) => {
      const where = buildWhereClause(table, criteria);
      return queryBuilder.findFirst({ where });
    },
    findMany: async (config) => {
      return queryMany(table, queryBuilder, config);
    },
    findPage: async (config) => {
      const pageSize = config?.paging?.pageSize || DEFAULT_PAGE_SIZE;
      const currentPage = (config?.paging?.page || 1) - 1;
      const limit = pageSize + 1;
      const offset = currentPage * pageSize;
      const rawResult = await queryMany(table, queryBuilder, {
        ...config,
        limit,
        offset
      });
      const hasMore = rawResult.length > pageSize;
      const result = hasMore ? rawResult.slice(0, -1) : rawResult;
      return {
        result,
        hasMore
      };
    },
    create: async (createWith) => {
      const inserted = await db.insert(table).values(createWith).returning();
      return inserted.shift();
    },
    update: async (id, updateWith) => {
      const updated = await db.update(table).set(updateWith).where(eq(table.id, id)).returning();
      return updated.shift();
    },
    delete: async (id) => {
      const deleteResult = await db.delete(table).where(eq(table.id, id)).returning();
      return deleteResult.shift();
    }
  };
};
export {
  createRepo,
  connectToDatabase
};
