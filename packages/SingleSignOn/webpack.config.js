const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { ModuleFederationPlugin } = require('webpack').container
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const deps = require('./package.json').dependencies

module.exports = {
    entry: './src/index',
    mode: 'development',
    devtool: 'inline-source-map',
    devServer: {
        port: 4001,
        open: true,
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
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },

    plugins: [
        new MiniCssExtractPlugin(),
        new ModuleFederationPlugin({
            name: 'singleSignOn',
            filename: 'remoteEntry.js',
            exposes: {
                './loginApp': './src/App'
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