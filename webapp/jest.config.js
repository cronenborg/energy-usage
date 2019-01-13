module.exports = {
    verbose: true,
    setupFiles: [
        './shim.js',
        './enzyme-setup.js'
    ],
    moduleNameMapper: {
        '\\.(css|scss)$': 'identity-obj-proxy'
    }
};
