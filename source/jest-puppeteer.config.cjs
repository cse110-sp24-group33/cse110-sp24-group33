module.exports = {
    launch: {
        headless: true,
        slowMo: 50,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    },
    browserContext: 'default'
};