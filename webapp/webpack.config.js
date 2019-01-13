const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

// Transpiling and Bundling config
module.exports = {
    context: path.join(__dirname, 'src'),
    entry: [
        './main.js'
    ],
    output: {
        path: path.join(__dirname, 'www'),
        filename: 'bundle.js'
    },
    module: {
        rules: [
            {
                test: /\.jsx?$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader'
                }
            },
            {
                test: /\.scss$/,
                use: [
                    {
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader',
                        options: {
                            modules: true,
                            localIdentName: '[path][name]__[local]--[hash:base64:5]'
                        }
                    },
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: 'index.html'
        })
    ],
    resolve: {
        modules: [
            path.join(__dirname, 'node_modules')
        ],
        extensions: ['.js', '.jsx']
    }
};

// For local development
module.exports.devServer = {
    contentBase: './www',
    port: 9000,
    proxy: {
        "/bulb/api": "http://localhost:8000"
    }
};

module.exports.devtool = 'inline-source-map';
