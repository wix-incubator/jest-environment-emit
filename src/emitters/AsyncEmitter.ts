export interface ReadonlyAsyncEmitter<Event extends { type: string }> {
  on<E extends Event>(
    type: E['type'] | '*',
    listener: (event: E) => void | Promise<void>,
    weight?: number,
  ): this;
  once<E extends Event>(
    type: E['type'] | '*',
    listener: (event: E) => void | Promise<void>,
    weight?: number,
  ): this;
  off<E extends Event>(type: E['type'] | '*', listener: (event: E) => void | Promise<void>): this;
}

export interface AsyncEmitter<Event extends { type: string }> extends ReadonlyAsyncEmitter<Event> {
  emit(event: Event): Promise<void>;
}
