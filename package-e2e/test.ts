import WithEmitter from 'jest-environment-emit';
import type { EnvironmentListenerFn } from 'jest-environment-emit';
import JsdomTestEnvironment from 'jest-environment-emit/jsdom';
import NodeTestEnvironment from 'jest-environment-emit/node';
import { aggregateLogs } from 'jest-environment-emit/debug';

function assertType<T>(_actual: T): void {
  // no-op
}

assertType<Function>(WithEmitter);
assertType<Function>(JsdomTestEnvironment);
assertType<Function>(NodeTestEnvironment);
assertType<Function>(aggregateLogs);

assertType<EnvironmentListenerFn>((context, options) => {
  context.env.global.__INJECT__ = options;
  context.testEvents.on('test_start', ({ event, state }) => {
    console.log(event.test.fn.toString(), state.rootDescribeBlock.name, options);
  });
});
