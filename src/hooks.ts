import type { EnvironmentContext, JestEnvironment, JestEnvironmentConfig } from '@jest/environment';
import type { Circus } from '@jest/types';
import { SemiAsyncEmitter } from './emitters';
import type { TestEnvironmentEvent } from './types';

const emitterMap: WeakMap<object, SemiAsyncEmitter<TestEnvironmentEvent>> = new WeakMap();
const configMap: WeakMap<object, JestEnvironmentConfig> = new WeakMap();

export function onTestEnvironmentCreate(
  jestEnvironment: JestEnvironment,
  jestEnvironmentConfig: JestEnvironmentConfig,
  environmentContext: EnvironmentContext,
): void {
  const emitter = new SemiAsyncEmitter<TestEnvironmentEvent>('environment', [
    'test_environment_create',
    'start_describe_definition',
    'finish_describe_definition',
    'add_hook',
    'add_test',
    'error',
  ]);

  emitterMap.set(jestEnvironment, emitter);
  configMap.set(jestEnvironment, jestEnvironmentConfig);
  emitter.emit({
    type: 'test_environment_create',
    env: jestEnvironment,
    context: environmentContext,
  });
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
  const reporterModules = (getConfig(env)?.globalConfig?.reporters ?? []).map((r) => r[0]);
  const reporterExports = await Promise.all(
    reporterModules.map((m) => {
      try {
        return import(m);
      } catch (error: unknown) {
        // TODO: log this to trace
        console.warn(`[jest-environment-emit] Failed to import reporter module "${m}"`, error);
        return;
      }
    }),
  );

  for (const reporterExport of reporterExports) {
    const ReporterClass = reporterExport?.default ?? reporterExport;
    ReporterClass?.onTestEnvironmentCreate?.(env);
  }
}
