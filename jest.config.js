module.exports = {
  testMatch: ["**/__tests__/**/*.test.(ts|tsx|js|jsx)"],
  transform: {
    "^.+\\.(ts|tsx)$": "ts-jest",
  },
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  moduleNameMapper: {
    "^@/(.*)$": "<rootDir>/src/$1",
  },
  testEnvironment: "node",
  collectCoverageFrom: ["src/**/*.{ts,tsx}", "!src/**/*.d.ts", "!src/**/__tests__/**"],
  coverageDirectory: "coverage",
  coverageReporters: ["text", "lcov", "html"],
};
