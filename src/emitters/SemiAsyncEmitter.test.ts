import { SemiAsyncEmitter } from './SemiAsyncEmitter';

describe('SemiAsyncEmitter', () => {
  let emitter: SemiAsyncEmitter<{ async_event: number }, { sync_event: number }>;

  beforeEach(() => {
    emitter = new SemiAsyncEmitter('test-emitter', ['sync_event']);
  });

  it('should emit promises for async events', async () => {
    const listener = jest.fn();
    emitter.on('async_event', listener);
    const promise = emitter.emit('async_event', 42);
    expect(promise).toBeInstanceOf(Promise);
    await promise;
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(42);
  });

  it('should emit voids for sync events', async () => {
    const listener = jest.fn();
    emitter.on('sync_event', listener);
    const promise = emitter.emit('sync_event', 42);
    expect(promise).toBeUndefined();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(42);
  });

  it('should allow wildcard listeners', async () => {
    const listener = jest.fn();
    emitter.on('*', listener);
    const result1 = emitter.emit('sync_event', 42);
    expect(result1).toBeUndefined();
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith(42);

    const result2 = emitter.emit('async_event', 84);
    expect(result2).toBeInstanceOf(Promise);
    await result2;
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith(84);
  });

  describe('unhappy paths', () => {
    describe('invalid type', () => {
      test.each([['on'], ['once'], ['emit'], ['off']])('in emitter.%s(...)', (method) =>
        // @ts-expect-error TS7053
        expect(() => emitter[method]()).toThrow(/type must be a string/),
      );
    });

    describe('invalid listener', () => {
      test.each([['on'], ['once'], ['off']])('in emitter.%s(...)', (method) =>
        // @ts-expect-error TS7053
        expect(() => emitter[method]('*')).toThrow(/listener must be a function/),
      );
    });

    describe('invalid order', () => {
      test.each([['on'], ['once']])('in emitter.%s(...)', (method) =>
        // @ts-expect-error TS7053
        expect(() => emitter[method]('*', () => {}, '')).toThrow(/order must be a number/),
      );
    });
  });
});
