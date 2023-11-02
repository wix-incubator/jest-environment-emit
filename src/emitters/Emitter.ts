export interface Emitter<Event extends { type: string }> extends ReadonlyEmitter<Event> {
  emit(event: Event): void;
}

export interface ReadonlyEmitter<Event extends { type: string }> {
  on(type: '*', listener: (event: Event) => unknown): this;
  on<E extends Event>(type: E['type'], listener: (event: E) => unknown): this;
  once(type: '*', listener: (event: Event) => unknown): this;
  once<E extends Event>(type: E['type'], listener: (event: E) => unknown): this;
  off(type: '*', listener: (event: Event) => unknown): this;
  off<E extends Event>(type: E['type'], listener: (event: E) => unknown): this;
}
