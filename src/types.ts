import type { EnvironmentContext, JestEnvironment, JestEnvironmentConfig } from '@jest/environment';
import type { Circus } from '@jest/types';
import type { ReadonlyAsyncEmitter } from './emitters';

export type TestEnvironmentEvent =
  | TestEnvironmentSetupEvent
  | TestEnvironmentTeardownEvent
  | TestEnvironmentCircusEvent;

export type TestEnvironmentSetupEvent = {
  type: 'test_environment_setup';
  env: JestEnvironment;
};

export type TestEnvironmentTeardownEvent = {
  type: 'test_environment_teardown';
  env: JestEnvironment;
};

export type TestEnvironmentCircusEvent<E extends Circus.Event = Circus.Event> = {
  type: E['name'];
  env: JestEnvironment;
  event: E;
  state: Circus.State;
};

export type EnvironmentListener<E extends JestEnvironment = JestEnvironment> =
  | EnvironmentListenerWithOptions<E>
  | EnvironmentListenerOnly<E>;

export type EnvironmentListenerWithOptions<E extends JestEnvironment = JestEnvironment> = [
  EnvironmentListenerOnly<E>,
  any,
];

export type EnvironmentListenerOnly<E extends JestEnvironment = JestEnvironment> =
  | EnvironmentListenerFn<E>
  | string;

export type EnvironmentListenerFn<E extends JestEnvironment = JestEnvironment> = (
  context: Readonly<EnvironmentListenerContext<E>>,
  listenerConfig?: any,
) => void;

export type EnvironmentListenerContext<E extends JestEnvironment = JestEnvironment> = {
  env: E;
  testEvents: ReadonlyAsyncEmitter<TestEnvironmentEvent>;
  context: EnvironmentContext;
  config: JestEnvironmentConfig;
};

export type { ReadonlyAsyncEmitter } from './emitters';
