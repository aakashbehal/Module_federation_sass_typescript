const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const deps = require('./package.json').dependencies
require('dotenv').config('./.env')

module.exports = {
    entry: './src/index',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 4002,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    },
    module: {
        rules: [
            {
                test: /\.(js|jsx|ts|tsx)$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.css$/i,
                use: ["style-loader", "css-loader"],
            },
            {
                test: /\.s?ass$/,
                oneOf: [
                    {
                        test: /\.module\.s?ass$/,
                        use: [
                            MiniCssExtractPlugin.loader,
                            {
                                loader: "css-loader",
                                options: {
                                    modules: {
                                        localIdentName: '[name]__[local]__[hash:base64:5]',
                                    }, importLoaders: 1
                                }
                            },
                            "sass-loader"
                        ]
                    },
                    {
                        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
                    }
                ]
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                use: [
                    {
                        loader: 'file-loader',
                    },
                ],
            },
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    plugins: [
        new webpack.DefinePlugin({
            "process.env": JSON.stringify(process.env)
        }),
        new MiniCssExtractPlugin(),
        new ModuleFederationPlugin({
            name: 'documentManager',
            filename: 'remoteEntry.js',
            exposes: {
                './documentApp': './src/bootstrap'
            },
            shared: {
                ...deps,
                react: {
                    singleton: true,
                    eager: true,
                    requiredVersion: deps.react
                },
                "react-dom": {
                    singleton: true,
                    eager: true,
                    requiredVersion: deps["react-dom"]
                }
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
};