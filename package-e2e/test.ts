import WithEmitter, { WithEmitter as WithEmitterNamed } from 'jest-environment-emit';
import JsdomTestEnvironment, { TestEnvironment as JsdomTestEnvironmentNamed } from 'jest-environment-emit/jsdom';
import NodeTestEnvironment, { TestEnvironment as NodeTestEnvironmentNamed } from 'jest-environment-emit/node';
import { aggregateLogs } from 'jest-environment-emit/debug';

function assertType<T>(_actual: T): void {
  // no-op
}

assertType<Function>(WithEmitter);
assertType<Function>(WithEmitterNamed);
assertType<Function>(JsdomTestEnvironment);
assertType<Function>(JsdomTestEnvironmentNamed);
assertType<Function>(NodeTestEnvironment);
assertType<Function>(NodeTestEnvironmentNamed);
assertType<Function>(aggregateLogs);
