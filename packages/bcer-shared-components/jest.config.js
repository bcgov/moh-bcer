module.exports = {
  testURL: 'http://localhost/',
  testEnvironment: 'jsdom',
  reporters: ['default', ['jest-junit', { output: './coverage/tests-report.xml' }]],
  preset: "ts-jest",
  testEnvironment: "jsdom",
  testPathIgnorePatterns: [
    "dist/*"
  ],
  moduleDirectories: [
    'node_modules',
    './'
  ],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\@/(.*)$': "<rootDir>/src/$1",
  },
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/index.ts',
    '!<rootDir>/src/ts/**/*.ts',
    '!<rootDir>/src/constants/**/*.{ts,tsx}',
    '!<rootDir>/src/__tests__/**/*.{ts,tsx}',
    '!<rootDir>/dist/__tests__/**/*.{ts,tsx}',
    '!<rootDir>/src/stories/**/*.{ts,tsx}',
  ],
  
};