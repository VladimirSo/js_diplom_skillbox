const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');


const conf = {
    context: path.resolve(__dirname, './src'),
    entry: {
        main: './index.js'
    },
    output: {
        path: path.resolve(__dirname, './dist'),
        filename: '[name].js',
        publicPath: 'auto',

        assetModuleFilename: '[name].[ext]',
    },

    devServer: {
        publicPath: 'http://localhost:8080/dist/',
        // publicPath: '/dist/',
        open: true,
        overlay: true,
        compress: true,
        inline: true,
        hot: true,

        // contentBase: [
        //     path.resolve(__dirname, './src'),
        //     // path.resolve(__dirname, './dist')
        // ],

        // watchContentBase: true,
    },
    //
    watchOptions: {
        aggregateTimeout: 600,
        ignored: [path.posix.resolve(__dirname, './node_modules')],
        poll: 1000,
    },
    // optimization: {
    //     minimize: false
    // },
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
            {
                test: /\.(jpg|png|svg|jpeg|gif)$/,
                type: 'asset/resource'
            },
            {
                // test: /\.css$/i,
                test: /\.(scss|css)$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/public/index_template.html'),
            filename: 'index.html',
            inject: 'body'
        }),
        // new CopyPlugin({
        //     patterns: [
        //         {
        //             from: path.resolve(__dirname, './src/images/**/*'),
        //             to: path.resolve(__dirname, './dist/images')
        //         },
        //     ],
        //     options: {
        //         concurrency: 100,
        //     },
        // }),
        new MiniCssExtractPlugin({
            linkType: 'text/css',
            insert: 'head',
            // filename: '[name].css',
            filename: 'css/[name].css',
            chunkFilename: 'css/[id].css',
        }),
        new webpack.HotModuleReplacementPlugin(),

    ],
    // devtool: 'eval-source-map'
    // target: 'web',
};

// module.exports = conf;
module.exports = (env, options) => {
    let production = options.mode === 'production';
    conf.devtool = production ? 'source-map' : 'eval-source-map';
    conf.output.clean = production ? true : false;
    conf.target = production ? 'browserslist' : 'web';

    return conf;
}
