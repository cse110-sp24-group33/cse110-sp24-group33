module.exports = {
    launch: {
        headless: true, // set to true if you want to run tests in headless mode
        slowMo: 50,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    browserContext: 'default'
};
