module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleFileExtensions: ['ts', 'js', 'json', 'tsx', 'jsx'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/*.test.ts'],
  transformIgnorePatterns: ['/node_modules/'],
};
