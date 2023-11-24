import JestEnvironmentNode from 'jest-environment-node';
import { WithEmitter } from './index';

export const TestEnvironment = WithEmitter(JestEnvironmentNode);
export default TestEnvironment;
