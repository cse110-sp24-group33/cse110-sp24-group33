module.exports = {
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    verbose: true,
    projects: [
        {
            displayName: "unit",
            testEnvironment: "jsdom",
            testMatch: ["**/unit/*.*.test.js"],
        },
        {
            displayName: "e2e",
            preset: "jest-puppeteer",
            testMatch: ["**/e2e/*.puppeteer.test.js"],
        },
    ],
};