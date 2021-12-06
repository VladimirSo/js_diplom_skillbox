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
        // publicPath: 'auto',
        publicPath: '/',

        assetModuleFilename: '[name].[ext]',
    },

    devServer: {
        // publicPath: 'http://localhost:8080/dist/',
        open: true,
        overlay: true,
        compress: true,
        inline: true,
        hot: true,
        historyApiFallback: true,

        // contentBase: [
        //     path.resolve(__dirname, './src'),
        //     // path.resolve(__dirname, './dist')
        // ],

        // watchContentBase: true,
        //
        // proxy: {
        //     '/view_photo_index': {
        //         target: 'https://unsplash.com/photos',
        //         changeOrigin: true,
        //         pathRewrite: { '^/view_photo_index': '/' },
        //     }

        // },
    },
    //
    watchOptions: {
        aggregateTimeout: 600,
        ignored: [path.posix.resolve(__dirname, './node_modules')],
        poll: 1000,
    },
    // без минификации js
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
                test: /\.(jpg|png|jpeg|gif)$/,
                type: 'asset/resource',
                generator: {
                    filename: 'images/[name][ext][query]'
                }
            },
            {
                test: /\.(scss|css)$/i,
                use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader']
            },
            {
                test: /\.(woff(2)?|ttf|eot|otf)(\?v=\d+\.\d+\.\d+)?$/,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            name: 'fonts/[name].[ext]'
                        }
                    },
                ]
            },
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: path.resolve(__dirname, './src/public/index_template.html'),
            filename: 'index.html',
            inject: 'body'
        }),
        new CopyPlugin({
            patterns: [
                {
                    from: '**/*',
                    context: path.resolve(__dirname, 'src', 'images'),
                    to: path.resolve(__dirname, './dist/images')
                },
                {
                    from: path.resolve(__dirname, 'src', 'favicon'),
                    to: path.resolve(__dirname, './dist/favicon')
                },
            ],
            options: {
                concurrency: 100,
            },
        }),
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
