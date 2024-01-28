import { type Table } from 'drizzle-orm';
import { Option } from 'effect';
export type EffectModel<T> = {
    [P in keyof T]: T[P] extends null | infer R ? Option.Option<R> : T[P];
};
export declare function createNullableFieldsMap(table: Table): Record<string, boolean>;
export declare function convertObject<T, U extends EffectModel<T>>(item: T, nullableFieldsMap: Record<string, boolean>): U;
export declare function convertToEffect<T, U extends EffectModel<T>>(obj: T, table: Table): U;
export declare function convertToEffectList<T, U extends EffectModel<T>>(objArray: T[], table: Table): U[];
export declare function convertFromEffect<T, U extends EffectModel<T>>(effectObj: U): T;
export declare function convertFromEffectList<T, U extends EffectModel<T>>(effectArray: U[]): T[];
