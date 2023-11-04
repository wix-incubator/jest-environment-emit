import type { Emitter } from './Emitter';
import { ReadonlyEmitterBase } from './ReadonlyEmitterBase';
import { __EMIT, __ENQUEUE, __INVOKE } from './syncEmitterCommons';

/**
 * An event emitter that emits events in the order they are received.
 * If an event is emitted while another event is being emitted, the new event
 * will be queued and emitted after the current event is finished.
 */
export class SerialSyncEmitter<Event extends { type: string }>
  extends ReadonlyEmitterBase<Event>
  implements Emitter<Event>
{
  #queue: Event[] = [];

  emit(nextEvent: Event): void {
    this.#queue.push(Object.freeze(nextEvent));

    if (this.#queue.length > 1) {
      this._log.trace(__ENQUEUE(nextEvent), `enqueue(${nextEvent.type})`);
      return;
    }

    while (this.#queue.length > 0) {
      const event = this.#queue[0];
      const eventType = event.type;
      const listeners = [...this._getListeners(eventType)];

      this._log.trace.complete(__EMIT(event), event.type, () => {
        if (listeners) {
          for (const listener of listeners) {
            this._log.trace.complete(__INVOKE(listener), 'invoke', () => listener(event));
          }
        }
      });

      this.#queue.shift();
    }
  }
}
