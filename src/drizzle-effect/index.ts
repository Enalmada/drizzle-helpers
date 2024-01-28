/* eslint-disable @typescript-eslint/no-explicit-any */

import { type Table } from 'drizzle-orm';
import { Option } from 'effect';

export type EffectModel<T> = {
  [P in keyof T]: T[P] extends null | infer R ? Option.Option<R> : T[P];
};

export function createNullableFieldsMap(table: Table): Record<string, boolean> {
  // @ts-expect-error error
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const columns = table[Symbol.for('drizzle:Columns')];
  const nullableFieldsMap: Record<string, boolean> = {};

  for (const columnName in columns) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    nullableFieldsMap[columnName] = !columns[columnName].config.notNull;
  }

  return nullableFieldsMap;
}

export function convertObject<T, U extends EffectModel<T>>(
  item: T,
  nullableFieldsMap: Record<string, boolean>
): U {
  const result: Partial<U> = {};

  for (const key in item) {
    const value = item[key];
    if (nullableFieldsMap[key]) {
      // @ts-expect-error error
      result[key as keyof U] = value === null ? Option.none() : Option.some(value);
    } else {
      result[key as keyof U] = value as unknown as U[keyof U];
    }
  }

  return result as U;
}

export function convertToEffect<T, U extends EffectModel<T>>(obj: T, table: Table): U {
  const nullableFieldsMap = createNullableFieldsMap(table);
  return convertObject<T, U>(obj, nullableFieldsMap);
}

export function convertToEffectList<T, U extends EffectModel<T>>(objArray: T[], table: Table): U[] {
  const nullableFieldsMap = createNullableFieldsMap(table);
  return objArray.map((obj) => convertObject<T, U>(obj, nullableFieldsMap));
}

// Function to convert a single object from the Effect model to the original format
export function convertFromEffect<T, U extends EffectModel<T>>(effectObj: U): T {
  const result: Partial<T> = {};

  for (const key in effectObj) {
    const value = effectObj[key as keyof U];
    if (Option.isOption(value)) {
      // @ts-expect-error error
      result[key as keyof T] = Option.isNone(value) ? null : value.value;
    } else {
      result[key as unknown as keyof T] = value as unknown as T[keyof T];
    }
  }

  return result as T;
}

// Function to convert an array of objects from the Effect model to the original format
export function convertFromEffectList<T, U extends EffectModel<T>>(effectArray: U[]): T[] {
  return effectArray.map((effectObj) => convertFromEffect<T, U>(effectObj));
}

/*
function exploreTableStructure(sqlObject) {
    if (sqlObject && sqlObject.queryChunks) {
        sqlObject.queryChunks.forEach(chunk => {
            const tableNameSymbol = Symbol.for('drizzle:Name');
            console.log(`Table: ${chunk[tableNameSymbol]}`);
            Object.keys(chunk).forEach(key => {
                const column = chunk[key];
                // Assuming each column has a 'config' property
                if (column.config) {
                    console.log(`Column: ${key}, Not Null: ${column.config.notNull}`);
                }
            });
        });
    }
}
exploreTableStructure(table.getSQL());

 */
