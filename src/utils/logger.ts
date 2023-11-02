import { noopLogger, wrapLogger } from 'bunyamin';
import { noop } from './noop';

export const logger = wrapLogger({
  logger: noopLogger(),
});

export const nologger = wrapLogger({
  logger: noopLogger(),
}) as typeof logger;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const optimizeTracing: <F>(f: F) => F = isTraceEnabled() ? (f) => f : ((() => noop) as any);

function isTraceEnabled(): boolean {
  return false;
}
