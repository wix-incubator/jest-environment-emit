import type { AsyncEmitter } from './AsyncEmitter';
import { ReadonlyEmitterBase } from './ReadonlyEmitterBase';
import { __EMIT, __INVOKE } from './syncEmitterCommons';

export class SerialAsyncEmitter<EventMap>
  extends ReadonlyEmitterBase<EventMap>
  implements AsyncEmitter<EventMap>
{
  #promise = Promise.resolve();

  emit<K extends keyof EventMap>(eventType: K, event: EventMap[K]): Promise<void> {
    return this.#enqueue(eventType, event);
  }

  #enqueue<K extends keyof EventMap>(eventType: K, event: EventMap[K]) {
    return (this.#promise = this.#promise.then(() => this.#doEmit(eventType, event)));
  }

  async #doEmit<K extends keyof EventMap>(eventType: K, event: EventMap[K]) {
    const listeners = [...this._getListeners(eventType)];

    await this._log.trace.complete(__EMIT(event), String(eventType), async () => {
      if (listeners) {
        for (const listener of listeners) {
          await this._log.trace.complete(__INVOKE(listener), 'invoke', () => listener(event));
        }
      }
    });
  }
}
