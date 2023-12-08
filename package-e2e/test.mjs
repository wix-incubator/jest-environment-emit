import assert from 'assert';
import WithEmitter from 'jest-environment-emit';
import JestEnvironmentEmitJsDOM from 'jest-environment-emit/jsdom';
import JestEnvironmentEmitNode from 'jest-environment-emit/node';
import { aggregateLogs } from 'jest-environment-emit/debug';

assert(typeof WithEmitter === 'function', 'jest-environment-emit should have a function as its default export');
assert(typeof JestEnvironmentEmitJsDOM === 'function', 'jest-environment-emit/jsdom should have a function as its default export');
assert(typeof JestEnvironmentEmitNode === 'function', 'jest-environment-emit/node should have a function as its default export');
assert(typeof aggregateLogs === 'function', 'jest-environment-emit/debug should have a named export `aggregateLogs`');
