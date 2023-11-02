import JestEnvironmentNode from 'jest-environment-node';
import { EmitterMixin } from './index';

export const TestEnvironment = EmitterMixin(JestEnvironmentNode);
export default TestEnvironment;
