import type { PgTableWithColumns } from "drizzle-orm/pg-core";
import type { RelationalQueryBuilder } from "drizzle-orm/pg-core/query-builders/query";
import type { PostgresJsDatabase } from "drizzle-orm/postgres-js";
import type { KnownKeysOnly } from "drizzle-orm/utils";
export interface OrderBy {
    sortBy: string;
    sortOrder: "asc" | "desc";
}
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
export interface IRepository<T, TI> {
    findFirst(criteria: Partial<T>, config?: Config<T>): Promise<T>;
    findMany(config?: Config<T>): Promise<T[]>;
    findPage(config?: Config<T>): Promise<Page<T>>;
    create(createWith: TI): Promise<T>;
    update(id: string, updateWith: TI): Promise<T>;
    delete(id: string): Promise<T>;
}
export declare const createRepo: <TSchema extends Record<string, unknown>, T extends {
    [key: string]: any;
}, TI extends {
    [key: string]: any;
}>(db: PostgresJsDatabase<TSchema>, table: PgTableWithColumns<any>, queryBuilder: RelationalQueryBuilder<T, any>) => IRepository<T, TI>;
