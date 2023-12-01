import { SerialAsyncEmitter } from './SerialAsyncEmitter';

describe('SerialAsyncEmitter', () => {
  it('should emit events', async () => {
    const emitter = new SerialAsyncEmitter<TestEventMap>('test-emitter');
    const listener = jest.fn();
    emitter.on('test', listener);

    await emitter.emit('test', { type: 'test', payload: 42 });
    expect(listener).toHaveBeenCalledTimes(1);
    expect(listener).toHaveBeenCalledWith({ type: 'test', payload: 42 });

    await emitter.emit('test', { type: 'test', payload: 84 });
    expect(listener).toHaveBeenCalledTimes(2);
    expect(listener).toHaveBeenCalledWith({ type: 'test', payload: 84 });
  });

  it('should allow subscribing to events only once', async () => {
    const emitter = new SerialAsyncEmitter<TestEventMap>('test-emitter');
    const listener = jest.fn();
    emitter.once('test', listener);
    await emitter.emit('test', { type: 'test', payload: 42 });
    expect(listener).toHaveBeenCalledWith({ type: 'test', payload: 42 });
    await emitter.emit('test', { type: 'test', payload: 84 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should allow subscribing to all events', async () => {
    const emitter = new SerialAsyncEmitter<TestEventMap>('test-emitter');
    const listener = jest.fn();
    emitter.on('*', listener);
    await emitter.emit('test', { type: 'test', payload: 42 });
    await emitter.emit('misc', { type: 'misc', payload: 84 });

    expect(listener).toHaveBeenCalledWith({ type: 'test', payload: 42 });
    expect(listener).toHaveBeenCalledWith({ type: 'misc', payload: 84 });
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('should allow unsubscribing from events', async () => {
    const emitter = new SerialAsyncEmitter<TestEventMap>('test-emitter');
    const listener = jest.fn();
    emitter.on('test', listener);
    await emitter.emit('test', { type: 'test', payload: 42 });
    expect(listener).toHaveBeenCalledTimes(1);
    emitter.off('test', listener);
    await emitter.emit('test', { type: 'test', payload: 84 });
    expect(listener).toHaveBeenCalledTimes(1);
  });

  it('should not delay emits within emits', async () => {
    const emitter = new SerialAsyncEmitter<TestEventMap>('test-emitter');
    const listener1 = jest.fn(() => emitter.emit('test', { type: 'test', payload: 84 }));
    const listener2 = jest.fn();
    emitter.once('test', listener1);
    emitter.on('test', listener2);
    await emitter.emit('test', { type: 'test', payload: 42 });
    expect(listener2).toHaveBeenCalledTimes(1);
  });
});

type TestEventMap = {
  test: { type: 'test'; payload: number };
  misc: { type: 'misc'; payload: number };
};
