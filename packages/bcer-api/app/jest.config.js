module.exports = {
  moduleNameMapper: {
    'src/(.*)': '<rootDir>/src/$1',
  },
  moduleFileExtensions: [
    'js',
    'json',
    'ts'
  ],
  moduleDirectories: [
    'node_modules',
    './src'
  ],
  testRegex: '.spec.ts$',
  transform: {
    '^.+\\.(t|j)s$': 'ts-jest'
  },
  coverageDirectory: './documentation/jest',
  testEnvironment: 'node'
}