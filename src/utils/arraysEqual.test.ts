import { arraysEqual } from './arraysEqual';

const EMPTY_OBJECT = {};
const EMPTY_ARRAY: unknown[] = [];
const FUNCTION = () => {};
const STRING = 'string';
const NUMBER = 123;
const BOOLEAN = true;
const ARRAY = [EMPTY_OBJECT, EMPTY_ARRAY, FUNCTION, STRING, NUMBER, BOOLEAN];

describe('arraysEqual', () => {
  it('should return true for empty arrays', () => {
    expect(arraysEqual([], [])).toBe(true);
  });

  it('should return true for the same array', () => {
    expect(arraysEqual(ARRAY, ARRAY)).toBe(true);
  });

  it('should return true for arrays with the same elements', () => {
    expect(arraysEqual([...ARRAY], [...ARRAY])).toBe(true);
  });

  it('should return false for arrays with different lengths', () => {
    const arr1 = Array.from({ length: 1 });
    const arr2 = Array.from({ length: 2 });
    expect(arraysEqual(arr1, arr2)).toBe(false);
  });

  it('should return false for arrays with different elements', () => {
    expect(arraysEqual([{}], [{}])).toBe(false);
  });
});
