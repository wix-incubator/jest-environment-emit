import { SerialSyncEmitter } from './SerialSyncEmitter';

describe('SerialSyncEmitter', () => {
  it('should emit events', () => {
    const emitter = new SerialSyncEmitter<TestEventMap>('test-emitter');
    const listener = jest.fn();
    emitter.on('test', listener);

    emitter.emit('test', { type: 'test', payload: 42 });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ type: 'test', payload: 42 });

    emitter.emit('test', { type: 'test', payload: 84 });
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith({ type: 'test', payload: 84 });
  });

  it('should allow subscribing to events only once', () => {
    const emitter = new SerialSyncEmitter<TestEventMap>('test-emitter');
    const listener = jest.fn();
    emitter.once('test', listener);
    emitter.emit('test', { type: 'test', payload: 42 });
    expect(listener).toHaveBeenCalledWith({ type: 'test', payload: 42 });
    emitter.emit('test', { type: 'test', payload: 84 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should allow subscribing to all events', () => {
    const emitter = new SerialSyncEmitter<TestEventMap>('test-emitter');
    const listener = jest.fn();
    emitter.on('*', listener);
    emitter.emit('test', { type: 'test', payload: 42 });
    emitter.emit('misc', { type: 'misc', payload: 84 });

    expect(listener).toHaveBeenCalledWith({ type: 'test', payload: 42 });
    expect(listener).toHaveBeenCalledWith({ type: 'misc', payload: 84 });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('should allow unsubscribing from events', () => {
    const emitter = new SerialSyncEmitter<TestEventMap>('test-emitter');
    const listener = jest.fn();
    emitter.on('test', listener);
    emitter.emit('test', { type: 'test', payload: 42 });
    expect(listener).toHaveBeenCalledTimes(1);
    emitter.off('test', listener);
    emitter.emit('test', { type: 'test', payload: 84 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should delay emits within emits', () => {
    const emitter = new SerialSyncEmitter<TestEventMap>('test-emitter');
    const listener1 = jest.fn(() => emitter.emit('test', { type: 'test', payload: 84 }));
    const listener2 = jest.fn();
    emitter.once('test', listener1);
    emitter.on('test', listener2);
    emitter.emit('test', { type: 'test', payload: 42 });
    expect(listener2).toHaveBeenCalledTimes(2);
    expect(listener2.mock.calls[0][0]).toEqual({ type: 'test', payload: 42 });
    expect(listener2.mock.calls[1][0]).toEqual({ type: 'test', payload: 84 });
  });

  it('should tolerate errors in listeners', () => {
    const emitter = new SerialSyncEmitter<TestEventMap>('test-emitter');
    const listener1 = jest.fn(() => {
      throw new Error('This listener failed');
    });
    const listener2 = jest.fn();
    emitter.once('test', listener1);
    emitter.once('test', listener2);
    expect(() => emitter.emit('test', { type: 'test', payload: 42 })).not.toThrow();
    expect(listener2).toHaveBeenCalledTimes(1);
  });
});

type TestEventMap = {
  test: { type: 'test'; payload: number };
  misc: { type: 'misc'; payload: number };
};
