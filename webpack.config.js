var webpack = require('webpack');
var path = require('path');

var APP_DIR = path.resolve(__dirname, 'javascript');

module.exports = {
    entry: {
        election: APP_DIR + '/Admin/Election/src/Election.jsx',
        list: APP_DIR + '/Admin/List/src/List.jsx',
        user: APP_DIR + '/User/src/Election.jsx'
    },
    output: {
        path: path.join(APP_DIR, "dist"),
        filename: "[name].bundle.js"
    },
    module: {
        loaders: [{
            test: /\.jsx?/,
            include: APP_DIR,
            loader: 'babel'
        }]
    },
    plugins: [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: true
            }
        })
    ],
    devtool: 'source-map'
}
