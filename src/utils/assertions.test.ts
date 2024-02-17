import { assertString, assertFunction, assertNumber } from './assertions';

describe('Tests assert functions', () => {
  test('successfully validates a string', () => {
    const testValue = 'test';
    expect(() => assertString(testValue, 'testValue')).not.toThrow();
  });

  test('throws error for non-string', () => {
    const testValue = 123;
    expect(() => assertString(testValue, 'testValue')).toThrow(TypeError);
  });

  test('successfully validates a function', () => {
    const testValue = () => {}; // dummy function
    expect(() => assertFunction(testValue, 'testValue')).not.toThrow();
  });

  test('throws error for non-function', () => {
    const testValue: any = 123;
    expect(() => assertFunction(testValue, 'testValue')).toThrow(TypeError);
  });

  test('successfully validates a number', () => {
    const testValue = 123;
    expect(() => assertNumber(testValue, 'testValue')).not.toThrow();
  });

  test('throws error for non-number', () => {
    const testValue: any = 'test';
    expect(() => assertNumber(testValue, 'testValue')).toThrow(TypeError);
  });
});
