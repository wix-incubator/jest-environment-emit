import type { JestEnvironment } from '@jest/environment';
import type { EnvironmentListenerOnly } from '../types';
import { logger } from '../utils';

export async function requireModule<E extends JestEnvironment = JestEnvironment>(
  rootDir: string,
  moduleName: string,
): Promise<EnvironmentListenerOnly<E> | null> {
  try {
    const cwdPath = require.resolve(moduleName, { paths: [rootDir] });
    const result = (await import(cwdPath)) as any;
    return (result?.default ?? result) as EnvironmentListenerOnly<E>;
  } catch (error: any) {
    logger.warn({ cat: 'import', err: error }, `Failed to resolve: ${moduleName}`);
    return null;
  }
}
