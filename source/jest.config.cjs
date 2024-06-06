module.exports = {
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    verbose: true,
    projects: [
        {
            displayName: "unit",
            testEnvironment: "jest-environment-jsdom",
            testMatch: ["__tests__/unit/*.*.test.js"],
        },
        {
            displayName: "e2e",
            preset: "jest-puppeteer",
            testMatch: ["__tests__/e2e/*.puppeteer.test.js"],
        },
    ],
};