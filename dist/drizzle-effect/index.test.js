// src/drizzle-effect/index.test.ts
import {Option} from "effect";
import {
convertFromEffect,
convertFromEffectList,
convertToEffect,
convertToEffectList,
createNullableFieldsMap
} from "./index";
var mockTable = {
  [Symbol.for("drizzle:Columns")]: {
    id: { config: { notNull: true } },
    name: { config: { notNull: false } }
  }
};
var userData = { id: "id", name: null };
var userDataList = [
  { id: "id", name: null },
  { id: "id", name: "bla" }
];
describe.only("drizzle-effect", () => {
  describe("object conversion", () => {
    it("option field", () => {
      const nullableFieldsMap = createNullableFieldsMap(mockTable);
      expect(nullableFieldsMap["id"]).toEqual(false);
      expect(nullableFieldsMap["name"]).toEqual(true);
    });
  });
  describe("convertToEffect Tests", () => {
    it("single should convert nullable fields to Option", () => {
      const result = convertToEffect(userData, mockTable);
      expect(result.id).toEqual("id");
      expect(Option.isOption(result.name)).toBeTruthy();
      expect(Option.isNone(result.name)).toBeTruthy();
      expect(result.name == null).toBeFalsy();
    });
    it("list should convert nullable fields to Option", () => {
      const result = convertToEffectList(userDataList, mockTable);
      expect(result[0]?.id).toEqual("id");
      expect(Option.isOption(result[0]?.name)).toBeTruthy();
      expect(Option.isNone(result[0].name)).toBeTruthy();
      expect(result[1]?.id).toEqual("id");
      expect(Option.isOption(result[1]?.name)).toBeTruthy();
      expect(Option.isSome(result[1].name)).toBeTruthy();
    });
  });
  describe("convertFromEffect Tests", () => {
    it("single should convert nullable fields to Option", () => {
      const temp = convertToEffect(userData, mockTable);
      const result = convertFromEffect(temp);
      expect(result.id).toEqual("id");
      expect(Option.isOption(result.name)).toBeFalsy();
      expect(result.name == null).toBeTruthy();
    });
    it("single should convert nullable fields to Option", () => {
      const temp = convertToEffectList(userDataList, mockTable);
      const result = convertFromEffectList(temp);
      expect(result[0]?.id).toEqual("id");
      expect(Option.isOption(result[0]?.name)).toBeFalsy();
      expect(result[0]?.name == null).toBeTruthy();
    });
  });
});
