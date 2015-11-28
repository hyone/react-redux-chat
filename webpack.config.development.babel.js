import path from 'path';
import webpack from 'webpack';

export default {
  cache: true,
  debug: true,
  devtool: 'eval-source-map',

  entry: {
    main: [
      'jquery',
      'bootstrap-sass',
      'webpack-hot-middleware/client',
      './src/index.js'
    ]
  },

  output: {
    filename: '[name].js',
    path: path.resolve('./dist'),
    publicPath: '/'
  },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      }
    ]
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('development')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.ProvidePlugin({
      $: 'jqeury',
      jQuery: 'jquery'
    })
  ],

  resolve: {
    extensions: ['', '.js'],
    moduleDirectories: [
      'node_modules'
    ],
    root: path.resolve('./src')
  },

  stats: {
    cached: true,
    cachedAssets: true,
    chunks: true,
    chunkModules: false,
    colors: true,
    hash: false,
    reasons: true,
    timings: true,
    version: false
  }
};
