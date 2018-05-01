const webpack = require('webpack');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const merge = require('webpack-merge');
const webpackBaseConfig = require('./webpack.config.js');

webpackBaseConfig.plugins = [];

module.exports = merge(webpackBaseConfig, {
  output: {
    publicPath: '/dist/',
    filename: '[name].[hash:5].js'
  },
  plugins: [
    new ExtractTextPlugin({
      filename: '[name].[hash:5].css',
      allChunks: true
    }),

    new webpack.DefinePlugin({
      'process_env': {
        'NODE_ENV': '"production"'
      }
    }),

    new webpack.optimize.UglifyJsPlugin({
      compress: {
        warnings: false
      }
    }),

    new HtmlWebpackPlugin({
      filename: '../index_prod.html',
      template: './index.ejs',
      inject: false
    })
  ]
});
