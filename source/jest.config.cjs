module.exports = {
    preset: 'jest-puppeteer',
    transform: {
        "^.+\\.[t|j]sx?$": "babel-jest"
    },
    verbose: true,
    globals: {
        // `jest-puppeteer` global configuration
        'jest-puppeteer': {
            launch: {
                headless: false, // Ensure tests run in headless mode
                slowMo: 50,
                args: ['--no-sandbox', '--disable-setuid-sandbox']
            },
            browserContext: 'default'
        }
    }
};
