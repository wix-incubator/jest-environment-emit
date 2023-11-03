import { isDebug } from 'bunyamin';
import { noop } from './noop';

export { default as logger } from 'bunyamin';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const optimizeTracing: <F>(f: F) => F = isDebug('jest-environment-emit')
  ? (f) => f
  : ((() => noop) as any);
