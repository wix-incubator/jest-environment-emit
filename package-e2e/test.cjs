const assert = require('assert');

const WithEmitter = require('jest-environment-emit');
assert(typeof WithEmitter === 'function', 'jest-environment-emit should have a function as its default export');

const JestEnvironmentEmitJsDOM = require('jest-environment-emit/jsdom');
assert(typeof JestEnvironmentEmitJsDOM === 'function', 'jest-environment-emit/jsdom should have a function as its default export');

const JestEnvironmentEmitNode = require('jest-environment-emit/node');
assert(typeof JestEnvironmentEmitNode === 'function', 'jest-environment-emit/node should have a function as its default export');

const debug = require('jest-environment-emit/debug');
assert(typeof debug.aggregateLogs === 'function', 'jest-environment-emit/debug should have a named export `aggregateLogs`');
