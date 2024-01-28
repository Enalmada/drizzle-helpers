import { type Table } from 'drizzle-orm';
import { Option } from 'effect';

import {
  convertFromEffect,
  convertFromEffectList,
  convertToEffect,
  convertToEffectList,
  createNullableFieldsMap,
  type EffectModel,
} from './index';

// Mock Table Configuration
const mockTable: Partial<Table> = {
  [Symbol.for('drizzle:Columns')]: {
    id: { config: { notNull: true } },
    name: { config: { notNull: false } },
  },
};

// Test Data
const userData = { id: 'id', name: null };
const userDataList = [
  { id: 'id', name: null },
  { id: 'id', name: 'bla' },
];

type UserMock = { id: string; name: string | null };

describe.only('drizzle-effect', () => {
  describe('object conversion', () => {
    it('option field', () => {
      const nullableFieldsMap = createNullableFieldsMap(mockTable as Table);

      expect(nullableFieldsMap['id']).toEqual(false);
      expect(nullableFieldsMap['name']).toEqual(true);
    });
  });

  describe('convertToEffect Tests', () => {
    it('single should convert nullable fields to Option', () => {
      type UserEffect = EffectModel<UserMock>;

      const result = convertToEffect<UserMock, UserEffect>(userData, mockTable as Table);
      expect(result.id).toEqual('id'); // Non-nullable field remains unchanged
      expect(Option.isOption(result.name)).toBeTruthy(); // Ensure this matches the actual imported Option type
      expect(Option.isNone(result.name)).toBeTruthy(); // Check if the Option is none
      expect(result.name == null).toBeFalsy(); // Check if the Option is none
    });

    it('list should convert nullable fields to Option', () => {
      type UserEffect = EffectModel<UserMock>;

      const result = convertToEffectList<UserMock, UserEffect>(userDataList, mockTable as Table);
      expect(result[0]?.id).toEqual('id'); // Non-nullable field remains unchanged
      expect(Option.isOption(result[0]?.name)).toBeTruthy(); // Ensure this matches the actual imported Option type
      expect(Option.isNone(result[0].name)).toBeTruthy(); // Check if the Option is none

      expect(result[1]?.id).toEqual('id'); // Non-nullable field remains unchanged
      expect(Option.isOption(result[1]?.name)).toBeTruthy(); // Ensure this matches the actual imported Option type
      expect(Option.isSome(result[1].name)).toBeTruthy(); // Check if the Option is none
    });
  });

  describe('convertFromEffect Tests', () => {
    it('single should convert nullable fields to Option', () => {
      type UserEffect = EffectModel<UserMock>;
      const temp = convertToEffect<UserMock, UserEffect>(userData, mockTable as Table);

      const result = convertFromEffect<UserMock, UserEffect>(temp);
      expect(result.id).toEqual('id'); // Non-nullable field remains unchanged
      expect(Option.isOption(result.name)).toBeFalsy(); // Ensure this matches the actual imported Option type
      expect(result.name == null).toBeTruthy(); // Check if the Option is none
    });

    it('single should convert nullable fields to Option', () => {
      type UserEffect = EffectModel<UserMock>;
      const temp = convertToEffectList<UserMock, UserEffect>(userDataList, mockTable as Table);

      const result = convertFromEffectList<UserMock, UserEffect>(temp);
      expect(result[0]?.id).toEqual('id'); // Non-nullable field remains unchanged
      expect(Option.isOption(result[0]?.name)).toBeFalsy(); // Ensure this matches the actual imported Option type
      expect(result[0]?.name == null).toBeTruthy(); // Check if the Option is none
    });
  });
});
