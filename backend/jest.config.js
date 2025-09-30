module.exports = {
  testEnvironment: 'node',
  setupFilesAfterEnv: ['./tests/setup.js'],
  testPathIgnorePatterns: ['/node_modules/'],
  moduleNameMapper: {
    '^../middlewares/authMiddleware$': '<rootDir>/tests/__mocks__/authMiddleware.js',
  },
};