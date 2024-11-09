module.exports = {
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  moduleNameMapper: {
    '^firebase/(.*)$': '<rootDir>/node_modules/firebase/$1',
  },
  transformIgnorePatterns: ['node_modules/(?!firebase)'],
};
