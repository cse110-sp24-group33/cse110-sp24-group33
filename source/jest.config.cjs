module.exports = {
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    preset: 'jest-puppeteer',
    verbose: true,
    testEnvironment: "jest-environment-jsdom"
};