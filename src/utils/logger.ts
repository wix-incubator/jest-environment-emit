import { bunyamin, nobunyamin, isDebug } from 'bunyamin';
import { noop } from './noop';

const PACKAGE_NAME = 'jest-environment-emit';

bunyamin.threadGroups.push({
  id: PACKAGE_NAME,
  displayName: PACKAGE_NAME,
});

bunyamin.logger = {
  fatal: console.error,
  error: console.error,
  warn: console.warn,
  info: console.log,
  debug: console.log,
  trace: console.log,
};

export const logger = isDebug(PACKAGE_NAME) ? bunyamin : nobunyamin;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const optimizeTracing: <F>(f: F) => F = isDebug(PACKAGE_NAME)
  ? (f) => f
  : ((() => noop) as any);