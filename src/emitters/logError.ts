import { logger } from '../utils';

// eslint-disable-next-line @typescript-eslint/ban-types
export function logError(error: unknown, eventType: string, listener: Function) {
  const errorDetails = (error instanceof Error && error.stack) || String(error);
  logger.warn(
    `Caught an error while emitting "${eventType}" event:\n${errorDetails}\nThe listener function was:\n${listener}`,
  );
}
