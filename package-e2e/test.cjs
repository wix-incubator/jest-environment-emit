const assert = require('assert');

const index = require('jest-environment-emit');
assert(typeof index.default === 'function', 'jest-environment-emit should have a function as its default export');
assert.strictEqual(index.default, index.WithEmitter, 'jest-environment-emit should have a named alternative to its default export');

const jsdom = require('jest-environment-emit/jsdom');
assert(typeof jsdom.default === 'function', 'jest-environment-emit/jsdom should have a function as its default export');
assert.strictEqual(jsdom.default, jsdom.TestEnvironment, 'jest-environment-emit/jsdom should have a named export `TestEnvironment`');

const node = require('jest-environment-emit/node');
assert(typeof node.default === 'function', 'jest-environment-emit/node should have a function as its default export');
assert.strictEqual(node.default, node.TestEnvironment, 'jest-environment-emit/node should have a named export `TestEnvironment`');

const debug = require('jest-environment-emit/debug');
assert(typeof debug.aggregateLogs === 'function', 'jest-environment-emit/debug should have a named export `aggregateLogs`');
