import type { EnvironmentContext, JestEnvironment, JestEnvironmentConfig } from '@jest/environment';
import type { Circus } from '@jest/types';
import { ResolvedEnvironmentListener, resolveSubscription } from './callbacks';
import { SemiAsyncEmitter } from './emitters';
import type {
  EnvironmentListener,
  EnvironmentListenerFn,
  EnvironmentListenerContext,
  TestEnvironmentEvent,
} from './types';
import { getHierarchy } from './utils';

type EnvironmentInternalContext = {
  testEvents: SemiAsyncEmitter<TestEnvironmentEvent>;
  environmentConfig: JestEnvironmentConfig;
  environmentContext: EnvironmentContext;
};

const contexts: WeakMap<JestEnvironment, EnvironmentInternalContext> = new WeakMap();
const staticListeners: WeakMap<object, EnvironmentListenerFn[]> = new WeakMap();

export function onTestEnvironmentCreate(
  jestEnvironment: JestEnvironment,
  jestEnvironmentConfig: JestEnvironmentConfig,
  environmentContext: EnvironmentContext,
): void {
  const testEvents = new SemiAsyncEmitter<TestEnvironmentEvent>('jest-environment-emit', [
    'start_describe_definition',
    'finish_describe_definition',
    'add_hook',
    'add_test',
    'error',
  ]);

  contexts.set(jestEnvironment, {
    testEvents,
    environmentConfig: normalizeJestEnvironmentConfig(jestEnvironmentConfig),
    environmentContext,
  });
}

export async function onTestEnvironmentSetup(env: JestEnvironment): Promise<void> {
  await subscribeToEvents(env);
  await getContext(env).testEvents.emit({ type: 'test_environment_setup', env });
}

export const onHandleTestEvent = (
  env: JestEnvironment,
  event: Circus.Event,
  state: Circus.State,
): void | Promise<void> => getContext(env).testEvents.emit({ type: event.name, env, event, state });

export async function onTestEnvironmentTeardown(env: JestEnvironment): Promise<void> {
  await getContext(env).testEvents.emit({ type: 'test_environment_teardown', env });
}

export const registerSubscription = <E extends JestEnvironment>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  klass: Function,
  callback: EnvironmentListenerFn<E>,
) => {
  const callbacks = staticListeners.get(klass) ?? [];
  callbacks.push(callback as EnvironmentListenerFn);
  staticListeners.set(klass, callbacks);
};

async function subscribeToEvents(env: JestEnvironment) {
  const envConfig = getContext(env).environmentConfig;
  const { projectConfig } = envConfig;
  const testEnvironmentOptions = projectConfig.testEnvironmentOptions;
  const staticRegistrations = collectStaticRegistrations(env);
  const configRegistrationsRaw = (testEnvironmentOptions.eventListeners ??
    []) as EnvironmentListener[];
  const configRegistrations = await Promise.all(
    configRegistrationsRaw.map((r) => resolveSubscription(projectConfig.rootDir, r)),
  );

  const context = getCallbackContext(env);

  for (const [callback, options] of [...staticRegistrations, ...configRegistrations]) {
    await callback(context, options);
  }
}

function getContext(env: JestEnvironment): EnvironmentInternalContext {
  const memo = contexts.get(env);
  if (!memo) {
    throw new Error(
      'Environment context is not found. Most likely, you are using a non-valid environment reference.',
    );
  }

  return memo;
}

function getCallbackContext(env: JestEnvironment): EnvironmentListenerContext {
  const memo = getContext(env);

  return Object.freeze({
    env,
    testEvents: memo.testEvents,
    context: memo.environmentContext,
    config: memo.environmentConfig,
  });
}

/** Jest 27 legacy support */
function normalizeJestEnvironmentConfig(jestEnvironmentConfig: JestEnvironmentConfig) {
  return jestEnvironmentConfig.globalConfig
    ? jestEnvironmentConfig
    : ({ projectConfig: jestEnvironmentConfig as unknown } as JestEnvironmentConfig);
}

function collectStaticRegistrations<E extends JestEnvironment>(
  env: E,
): ResolvedEnvironmentListener<E>[] {
  return getHierarchy(env)
    .flatMap((klass) => staticListeners.get(klass) ?? [])
    .map((callback) => [callback, void 0]);
}
