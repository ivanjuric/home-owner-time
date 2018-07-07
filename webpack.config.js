const path = require('path');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const webpack = require('webpack');

module.exports = {
    entry: './src/index.js',
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist'),
        publicPath: '/'
    },
    devtool: 'inline-source-map',
    devServer:{
        contentBase: './dist',
        hot: true,
        open: true
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: [
                    'babel-loader'
                ]
            },
            {
                test: /\.css$/,
                use: [
                    'style-loader',
                    'css-loader'
                ]
            }
        ]
    },
    plugins: [
        new HtmlWebPackPlugin(),
        new webpack.HotModuleReplacementPlugin()
    ]
};