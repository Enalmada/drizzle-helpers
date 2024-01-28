// src/drizzle-effect/index.ts
import {Option} from "effect";
function createNullableFieldsMap(table) {
  const columns = table[Symbol.for("drizzle:Columns")];
  const nullableFieldsMap = {};
  for (const columnName in columns) {
    nullableFieldsMap[columnName] = !columns[columnName].config.notNull;
  }
  return nullableFieldsMap;
}
function convertObject(item, nullableFieldsMap) {
  const result = {};
  for (const key in item) {
    const value = item[key];
    if (nullableFieldsMap[key]) {
      result[key] = value === null ? Option.none() : Option.some(value);
    } else {
      result[key] = value;
    }
  }
  return result;
}
function convertToEffect(obj, table) {
  const nullableFieldsMap = createNullableFieldsMap(table);
  return convertObject(obj, nullableFieldsMap);
}
function convertToEffectList(objArray, table) {
  const nullableFieldsMap = createNullableFieldsMap(table);
  return objArray.map((obj) => convertObject(obj, nullableFieldsMap));
}
function convertFromEffect(effectObj) {
  const result = {};
  for (const key in effectObj) {
    const value = effectObj[key];
    if (Option.isOption(value)) {
      result[key] = Option.isNone(value) ? null : value.value;
    } else {
      result[key] = value;
    }
  }
  return result;
}
function convertFromEffectList(effectArray) {
  return effectArray.map((effectObj) => convertFromEffect(effectObj));
}
export {
  createNullableFieldsMap,
  convertToEffectList,
  convertToEffect,
  convertObject,
  convertFromEffectList,
  convertFromEffect
};
