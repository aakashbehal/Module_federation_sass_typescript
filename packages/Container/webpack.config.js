const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin')
const deps = require('./package.json').dependencies
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin')

module.exports = {
    mode: 'development',
    cache: false,
    entry: './src/index',
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
            {
                test: /\.s[ac]ss$/i,
                use: [
                    "style-loader",
                    "css-loader",
                    "sass-loader",
                ],
            }
        ],
    },
    resolve: {
        extensions: ['.tsx', '.ts', '.js'],
    },
    devServer: {
        static: {
            directory: path.join(__dirname, 'public'),
        },
        compress: true,
        port: 4000,
        open: true,
        headers: {
            "Access-Control-Allow-Origin": "*"
        }
    },
    plugins: [
        new ModuleFederationPlugin({
            name: 'container',
            remotes: {
                'singleSignOn': 'singleSignOn@http://localhost:4001/remoteEntry.js'
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
        }),
        new ForkTsCheckerWebpackPlugin()
    ]
};