var path = require('path');
var webpack = require('webpack');

module.exports = {
  devtool: 'inline-source-map',

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ],

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('test')
      })
    ],

    resolve: {
      alias: {
        test: path.resolve('./test')
      },
      root: path.resolve('./src')
    }
  }
};
