module.exports = {
    launch: {
        headless: true, // Ensure tests run in headless mode
        slowMo: 50,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    browserContext: 'default'
};
