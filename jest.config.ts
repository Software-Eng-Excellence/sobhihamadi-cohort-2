import type { Config } from 'jest';
const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests/services'],
  testMatch: ['**/*.test.ts'],
  verbose: true,
  collectCoverage: true,
  collectCoverageFrom: ['src/**/*.ts'],
    coverageDirectory: 'coverage',
    coverageThreshold: {
        global: {
      branches: 40, functions: 40, lines: 40, statements: 40


},},
}
export default config;