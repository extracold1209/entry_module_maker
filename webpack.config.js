const path = require('path');

module.exports = {
    mode: process.env.NODE_ENV || 'development',
    target: 'web',
    entry: path.join(__dirname, 'src', 'react', 'App.tsx'),
    output: {
        path: path.join(__dirname, 'public', 'dist'),
        filename: 'dist.bundle.js',
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    module: {
        rules: [
            {
                test: /\.tsx?/,
                loader: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
};
