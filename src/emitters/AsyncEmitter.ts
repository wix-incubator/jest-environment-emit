export interface ReadonlyAsyncEmitter<EventMap> {
  on<K extends keyof EventMap>(
    type: K | '*',
    listener: (event: EventMap[K]) => void | Promise<void>,
    weight?: number,
  ): this;
  once<K extends keyof EventMap>(
    type: K | '*',
    listener: (event: EventMap[K]) => void | Promise<void>,
    weight?: number,
  ): this;
  off<K extends keyof EventMap>(
    type: K | '*',
    listener: (event: EventMap[K]) => void | Promise<void>,
  ): this;
}

export interface AsyncEmitter<EventMap> extends ReadonlyAsyncEmitter<EventMap> {
  emit<K extends keyof EventMap>(type: K, event: EventMap[K]): Promise<void>;
}
