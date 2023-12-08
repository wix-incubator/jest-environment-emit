"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var jest_environment_emit_1 = require("jest-environment-emit");
var jsdom_1 = require("jest-environment-emit/jsdom");
var node_1 = require("jest-environment-emit/node");
var debug_1 = require("jest-environment-emit/debug");
function assertType(_actual) {
    // no-op
}
assertType(jest_environment_emit_1.default);
assertType(jest_environment_emit_1.WithEmitter);
assertType(jsdom_1.default);
assertType(jsdom_1.TestEnvironment);
assertType(node_1.default);
assertType(node_1.TestEnvironment);
assertType(debug_1.aggregateLogs);
