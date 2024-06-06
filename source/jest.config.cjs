module.exports = {
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    verbose: true,
    projects: [
        {
            displayName: "unit",
            testEnvironment: "jest-environment-jsdom",
            testMatch: ["**/*.*.test.js"],
        },
        {
            displayName: "e2e",
            preset: "jest-puppeteer",
            testMatch: ["**/*.puppeteer.test.js"],
        },
    ],
};