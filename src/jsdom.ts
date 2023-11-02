import JestEnvironmentJsdom from 'jest-environment-jsdom';
import { EmitterMixin } from './index';

export const TestEnvironment = EmitterMixin(JestEnvironmentJsdom);
export default TestEnvironment;
