export default {
  testEnvironment: 'node',
  testMatch: ['**/test/**/*.test.js'],
  verbose: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  transform: {}, // disables Babel transform
};