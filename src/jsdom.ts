import JestEnvironmentJsdom from 'jest-environment-jsdom';
import { WithEmitter } from './index';

export const TestEnvironment = WithEmitter(JestEnvironmentJsdom);
export default TestEnvironment;
