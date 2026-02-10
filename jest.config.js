require('dotenv').config();

module.exports = {
  testEnvironment: 'node',
  collectCoverageFrom: [
    'backend/**/*.js',
    '!backend/server.js',
  ],
  openHandlesTimeout: 5000,
};
