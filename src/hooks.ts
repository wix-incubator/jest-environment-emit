import type { EnvironmentContext, JestEnvironment, JestEnvironmentConfig } from '@jest/environment';
import type { Circus } from '@jest/types';
import { resolveSubscription } from './callbacks';
import { SemiAsyncEmitter } from './emitters';
import type {
  EmitterSubscription,
  EmitterSubscriptionContext,
  TestEnvironmentEvent,
} from './types';

const emitterMap: WeakMap<object, SemiAsyncEmitter<TestEnvironmentEvent>> = new WeakMap();
const configMap: WeakMap<object, JestEnvironmentConfig> = new WeakMap();
const contextMap: WeakMap<object, EnvironmentContext> = new WeakMap();
const registrationsMap: WeakMap<object, EmitterSubscription[]> = new WeakMap();

export function onTestEnvironmentCreate(
  jestEnvironment: JestEnvironment,
  jestEnvironmentConfig: JestEnvironmentConfig,
  environmentContext: EnvironmentContext,
): void {
  const emitter = new SemiAsyncEmitter<TestEnvironmentEvent>('jest-environment-emit', [
    'start_describe_definition',
    'finish_describe_definition',
    'add_hook',
    'add_test',
    'error',
  ]);

  emitterMap.set(jestEnvironment, emitter);
  configMap.set(jestEnvironment, normalizeJestEnvironmentConfig(jestEnvironmentConfig));
  contextMap.set(jestEnvironment, environmentContext);
}

/** Jest 27 legacy support */
function normalizeJestEnvironmentConfig(jestEnvironmentConfig: JestEnvironmentConfig) {
  return jestEnvironmentConfig.globalConfig
    ? jestEnvironmentConfig
    : ({ projectConfig: jestEnvironmentConfig as unknown } as JestEnvironmentConfig);
}

export async function onTestEnvironmentSetup(env: JestEnvironment): Promise<void> {
  await subscribeToEvents(env);
  await getEmitter(env).emit({ type: 'test_environment_setup', env });
}

export async function onTestEnvironmentTeardown(env: JestEnvironment): Promise<void> {
  await getEmitter(env).emit({ type: 'test_environment_teardown', env });
}

/**
 * Pass Jest Circus event and state to the handler.
 * After recalculating the state, this method synchronizes with the metadata server.
 */
export const onHandleTestEvent = (
  env: JestEnvironment,
  event: Circus.Event,
  state: Circus.State,
): void | Promise<void> => getEmitter(env).emit({ type: event.name, env, event, state });

/**
 * Get the environment event emitter by the environment reference.
 */
export const getEmitter = (env: JestEnvironment) => {
  const emitter = emitterMap.get(env);
  if (!emitter) {
    throw new Error(
      'Emitter is not found. Most likely, you are using a non-valid environment reference.',
    );
  }

  return emitter;
};

export const registerSubscription = <E extends JestEnvironment>(subscription: EmitterSubscription<E>) => {
  const callbacks = registrationsMap.get(global) ?? [];
  callbacks.push(subscription as EmitterSubscription);
  registrationsMap.set(global, callbacks);
};

/**
 * Get the environment configuration by the environment reference.
 */
export const getConfig = (env: JestEnvironment) => {
  const config = configMap.get(env);
  if (!config) {
    throw new Error(
      'Environment config is not found. Most likely, you are using a non-valid environment reference.',
    );
  }

  return config;
};

async function subscribeToEvents(env: JestEnvironment) {
  const envConfig = getConfig(env);
  const { projectConfig } = envConfig;
  const testEnvironmentOptions = projectConfig.testEnvironmentOptions;
  const staticRegistrations = registrationsMap.get(global) ?? [];
  const configRegistrations = (testEnvironmentOptions.eventListeners ??
    []) as EmitterSubscription[];
  const allRegistrations = [...staticRegistrations, ...configRegistrations];

  const callbacks = await Promise.all(
    allRegistrations.map((r) => resolveSubscription(projectConfig.rootDir, r)),
  );

  const context = Object.freeze({
    env,
    testEvents: getEmitter(env),
    context: contextMap.get(env),
    config: envConfig,
  }) as Readonly<EmitterSubscriptionContext>;

  for (const fn of callbacks) {
    fn(context);
  }
}
