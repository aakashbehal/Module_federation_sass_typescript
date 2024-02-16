const path = require('path');
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const deps = require('./package.json').dependencies
const devDeps = require('./package.json').devDependencies
require('dotenv').config('./.env')

module.exports = {
    entry: './src/index',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        client: {
            overlay: false
        },
        port: 4001,
        historyApiFallback: true,
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
                        use: [MiniCssExtractPlugin.loader, "css-loader", "sass-loader"]
                    },
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
            name: 'singleSignOn',
            filename: 'remoteEntry.js',
            exposes: {
                './authApp': './src/bootstrap',
                './LogoutButton': './src/components/LogoutButton',
                './TopNavigation': './src/components/TopNavigation/TopNavigation',
                './UserService': './src/services/user.service'
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
                },
                "react-bootstrap": {
                    singleton: true,
                    eager: true,
                    requiredVersion: devDeps["react-bootstrap"]
                }
            }
        }),
        new HtmlWebpackPlugin({
            template: './public/index.html'
        })
    ]
};