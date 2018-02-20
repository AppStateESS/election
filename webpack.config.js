var setup = require('./exports.js')
var webpack = require('webpack');
var Promise = require('es6-promise').polyfill();
var BrowserSyncPlugin = require('browser-sync-webpack-plugin')

module.exports = {
  entry: setup.entry,
  output: {
    path: setup.path.join(setup.APP_DIR, "dev"),
    filename: "[name].js",
  },
  resolve: {
    extensions: [
      '.js', '.jsx',
    ],
  },
  plugins: [
    new webpack.optimize.CommonsChunkPlugin(
      {name: 'vendor', filename: 'vendor.js',}
    ),
    new BrowserSyncPlugin(
      {host: 'localhost', port: 3000, files: ['./javascript/dev/*.js'], proxy: 'localhost/phpwebsite',}
    ),
  ],
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        enforce: 'pre',
        loader: 'jshint-loader',
        exclude: '/node_modules/',
        include: setup.APP_DIR + '/dev',
      }, {
        test: /\.(png|woff|woff2|eot|ttf|svg)$/,
        loader: 'url-loader?limit=100000',
      }, {
        test: /\.jsx?/,
        include: setup.APP_DIR,
        loader: 'babel-loader',
        query: {
          presets: ['es2015', 'react',]
        },
      }, {
        test: /\.css$/,
        loader: 'style-loader!css-loader',
      },
    ]
  },
  devtool: 'source-map',
}
