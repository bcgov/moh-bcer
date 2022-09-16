module.exports = {
  testURL: 'http://localhost/',
  testEnvironment: 'jsdom',
  setupFiles: ['<rootDir>/jest.setup.js'],
  reporters: ['default', ['jest-junit', { output: './coverage/tests-report.xml' }]],
  moduleNameMapper: {
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$': 'jest-transform-stub',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\@/(.*)$': "<rootDir>/src/$1",
  },
  modulePathIgnorePatterns: ["__mocks__"],
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}',
    '!<rootDir>/src/App.tsx',
    '!<rootDir>/src/index.tsx',
    '!<rootDir>/src/serviceWorker.ts',
    '!<rootDir>/src/store/index.ts',
    '!<rootDir>/src/ts/**/*.ts',
    '!<rootDir>/src/constants/**/*.{ts,tsx}',
    '!<rootDir>/src/routes/**/*.{ts,tsx}',
    '!<rootDir>/src/__tests__/**/*.{ts,tsx}',
  ],
};