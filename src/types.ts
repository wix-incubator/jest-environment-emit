import type { EnvironmentContext, JestEnvironment } from '@jest/environment';
import type { Circus } from '@jest/types';
import type { ReadonlyAsyncEmitter } from './emitters';

export type TestEnvironmentEvent =
  | { type: 'test_environment_create'; env: JestEnvironment; context: EnvironmentContext }
  | { type: 'test_environment_setup'; env: JestEnvironment }
  | { type: 'test_environment_teardown'; env: JestEnvironment }
  | TestEnvironmentCircusEvent;

export type TestEnvironmentCircusEvent<E extends Circus.Event = Circus.Event> = {
  type: E['name'];
  env: JestEnvironment;
  event: E;
  state: Circus.State;
};

export type WithEmitter<E extends JestEnvironment = JestEnvironment> = E & {
  readonly testEvents: ReadonlyAsyncEmitter<TestEnvironmentEvent>;
};

export type { ReadonlyAsyncEmitter } from './emitters';
