import path    from 'path';
import webpack from 'webpack';

export default {
  devtool: 'inline-source-map',

  // entry: {
    // main: glob.sync('./test/**/*.spec.js')
  // },

  // output: {
    // filename: '[name].js',
    // path: path.resolve('./tmp')
  // },

  module: {
    loaders: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel'
      },
      {
        test: /\.scss$/,
        include: path.resolve('./src/styles'),
        exclude: /node_modules/,
        loader: 'null'
      }
    ],

    plugins: [
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify('test')
      })
    ]
  },

  resolve: {
    extensions: ['', '.js'],
    modulesDirectories: [
      'src',
      'node_modules'
    ],
    root: path.resolve('./test')
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
