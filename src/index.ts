import type { JestEnvironment } from '@jest/environment';
import type { Circus } from '@jest/types';

import {
  getEmitter,
  onHandleTestEvent,
  onTestEnvironmentCreate,
  onTestEnvironmentSetup,
  onTestEnvironmentTeardown,
  registerSubscription,
} from './hooks';

import type {
  EmitterSubscription,
  ReadonlyAsyncEmitter,
  TestEnvironmentEvent,
  WithEmitter,
} from './types';

export * from './types';

/**
 * Decorator for a given JestEnvironment subclass that extends
 * {@link JestEnvironment#constructor}, {@link JestEnvironment#global},
 * {@link JestEnvironment#setup}, and {@link JestEnvironment#handleTestEvent}
 * and {@link JestEnvironment#teardown} in an extensible way.
 *
 * You won't need to extend this class directly – instead, you can tap into
 * the lifecycle events by registering listeners on the `testEvents` property
 * of the decorated Jest environment instance.
 *
 * Even a less intrusive way to tap into the lifecycle events is to use the
 * static `register` method, which accepts a callback that will be invoked
 * with the decorated Jest environment instance, the emitter, and the
 * environment context.
 *
 * @param JestEnvironmentClass - Jest environment subclass to decorate
 * @returns a decorated Jest environment subclass, e.g. `WithMetadata(JestEnvironmentNode)`
 * @example
 * ```javascript
 * import WithEmitter from 'jest-environment-emit';
 *
 * class MyEnvironment implements JestEnvironment {
 *   // ...
 * }
 *
 * WithEmitter.register(({ env, emitter, context }) => {
 *   emitter.on('test_environment_setup', async () => {})
 *          .on('test_environment_teardown', async () => {})
 *          .on('setup', async () => {})
 *          .on('teardown', async () => {})
 *          .on('add_hook', () => {})
 *          .on('add_test', () => {})
 *          .on('error', () => {});
 *          .on('test_fn_start', async () => {})
 *          .on('test_fn_success', async () => {})
 *          .on('test_fn_failure', async () => {});
 * });
 *
 * export default WithEmitter(MyEnvironment);
 * ```
 */
export function EmitterMixin<E extends JestEnvironment>(
  JestEnvironmentClass: new (...args: any[]) => E,
): EmitterMixinClass<E> {
  const compositeName = `WithEmitter(${JestEnvironmentClass.name})`;

  return {
    // @ts-expect-error TS2415: Class '[`${compositeName}`]' incorrectly extends base class 'E'.
    [`${compositeName}`]: class extends JestEnvironmentClass {
      constructor(...args: any[]) {
        super(...args);
        onTestEnvironmentCreate(this, args[0], args[1]);
      }

      protected get testEvents(): ReadonlyAsyncEmitter<TestEnvironmentEvent> {
        return getEmitter(this);
      }

      static subscribe(subscription: EmitterSubscription<E>) {
        registerSubscription(this, subscription);
      }

      async setup() {
        await super.setup?.();
        await onTestEnvironmentSetup(this);
      }

      // @ts-expect-error TS2415: The base class has an arrow function, but this can be a method
      handleTestEvent(event: Circus.Event, state: Circus.State): void | Promise<void> {
        const maybePromise = (super.handleTestEvent as JestEnvironment['handleTestEvent'])?.(
          event as any,
          state,
        );

        return typeof maybePromise?.then === 'function'
          ? maybePromise.then(() => onHandleTestEvent(this, event, state))
          : onHandleTestEvent(this, event, state);
      }

      async teardown() {
        await super.teardown?.();
        await onTestEnvironmentTeardown(this);
      }
    },
  }[compositeName] as unknown as EmitterMixinClass<E>;
}

EmitterMixin.subscribe = (subscription: EmitterSubscription) =>
  registerSubscription(Object.getPrototypeOf(EmitterMixin), subscription);

export type WithSubscribe<E extends JestEnvironment = JestEnvironment> = {
  subscribe(subscription: EmitterSubscription<E>): void;
};

export type EmitterMixinClass<E extends JestEnvironment> = WithSubscribe<E> &
  (new (...args: any[]) => WithEmitter<E>);

/**
 * @inheritDoc
 */
export default EmitterMixin as WithSubscribe & typeof EmitterMixin;
