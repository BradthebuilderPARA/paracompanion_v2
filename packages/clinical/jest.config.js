module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
    }],
  },
  transformIgnorePatterns: ['node_modules/(?!@paracompanion)'],
  moduleNameMapper: {
    '^@paracompanion/airlock$': '<rootDir>/__mocks__/airlock.ts',
    '^@paracompanion/(.*)$': '<rootDir>/../$1/index.ts'
  }
};
