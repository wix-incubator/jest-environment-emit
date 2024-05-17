import { arraysEqual } from '../utils';
import type { AsyncEmitter } from './AsyncEmitter';
import { logError } from './logError';
import { ReadonlyEmitterBase } from './ReadonlyEmitterBase';
import { __EMIT, __INVOKE } from './syncEmitterCommons';

export class SerialAsyncEmitter<EventMap>
  extends ReadonlyEmitterBase<EventMap>
  implements AsyncEmitter<EventMap>
{
  #tasks: Promise<void>[] = [];
  #idle?: Promise<void>;

  emit<K extends keyof EventMap>(eventType: K, event: EventMap[K]): Promise<void> {
    this.#tasks.push(this.#doEmit(eventType, event));
    this.#idle ??= this.#waitForIdle();
    return this.#idle;
  }

  async #waitForIdle() {
    let $promises: Promise<void>[] = [];
    while (!arraysEqual($promises, this.#tasks)) {
      $promises = [...this.#tasks];
      await Promise.all($promises);
    }

    this.#tasks.splice(0, this.#tasks.length);
    this.#idle = undefined;
  }

  async #doEmit<K extends keyof EventMap>(eventType: K, event: EventMap[K]) {
    const listeners = [...this._getListeners(eventType)];
    const $eventType = String(eventType);

    await this._log.trace.complete(__EMIT(event), $eventType, async () => {
      if (listeners) {
        for (const listener of listeners) {
          try {
            await this._log.trace.complete(__INVOKE(listener), 'invoke', () => listener(event));
          } catch (error: unknown) {
            logError(error, $eventType, listener);
          }
        }
      }
    });
  }
}
