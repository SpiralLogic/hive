// babel.config.js
module.exports = {
    presets: [
        '@babel/preset-env',
        '@babel/preset-typescript',
        'babel-preset-typescript',
        {
            targets: {
                node: 'current',
            },
        },
    ],
};
    