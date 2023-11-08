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

export type HasEmitter<E extends JestEnvironment = JestEnvironment> = E & {
  readonly testEvents: ReadonlyAsyncEmitter<TestEnvironmentEvent>;
};

export type EmitterSubscriptionContext<E extends JestEnvironment = JestEnvironment> = {
  env: E;
  testEvents: ReadonlyAsyncEmitter<TestEnvironmentEvent>;
  context: EnvironmentContext;
  config: JestEnvironmentConfig;
};

export type AsyncTestEventListener<E extends TestEnvironmentEvent = TestEnvironmentEvent> = (
  event: E,
) => void | Promise<void>;

export type SyncTestEventListener<E extends TestEnvironmentEvent = TestEnvironmentEvent> = (
  event: E,
) => void;

export type EmitterSubscriptionCallback<E extends JestEnvironment = JestEnvironment> = (
  context: Readonly<EmitterSubscriptionContext<E>>,
) => void;

export type EmitterSubscription<E extends JestEnvironment = JestEnvironment> =
  | EmitterSubscriptionCallback<E>
  | Partial<
      {
        '*': AsyncTestEventListener;
        test_environment_setup: AsyncTestEventListener<TestEnvironmentSetupEvent>;
        test_environment_teardown: AsyncTestEventListener<TestEnvironmentTeardownEvent>;
        start_describe_definition: SyncTestEventListener<
          TestEnvironmentCircusEvent & { type: 'start_describe_definition' }
        >;
        finish_describe_definition: SyncTestEventListener<
          TestEnvironmentCircusEvent & { type: 'finish_describe_definition' }
        >;
        add_hook: SyncTestEventListener<TestEnvironmentCircusEvent & { type: 'add_hook' }>;
        add_test: SyncTestEventListener<TestEnvironmentCircusEvent & { type: 'add_test' }>;
        error: SyncTestEventListener<TestEnvironmentCircusEvent & { type: 'error' }>;
      } & {
        [key in TestEnvironmentEvent['type']]: AsyncTestEventListener<
          TestEnvironmentCircusEvent & { type: key }
        >;
      }
    >;

export type { ReadonlyAsyncEmitter } from './emitters';
