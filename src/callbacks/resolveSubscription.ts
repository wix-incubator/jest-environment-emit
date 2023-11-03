import type { JestEnvironment } from '@jest/environment';
import type { EmitterSubscription, EmitterSubscriptionCallback } from '../types';
import { requireModule } from './requireModule';

export async function resolveSubscription<E extends JestEnvironment = JestEnvironment>(
  rootDir: string,
  registration: EmitterSubscription<E> | null,
): Promise<EmitterSubscriptionCallback<E>> {
  if (registration == null) {
    return () => {};
  }

  if (typeof registration === 'string') {
    return resolveSubscription(rootDir, await requireModule(rootDir, registration));
  }

  if (typeof registration === 'function') {
    return registration;
  }

  return (context) => {
    for (const [type, listener] of Object.entries(registration)) {
      context.testEvents.on(type as any, listener as any);
    }
  };
}
