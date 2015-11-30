import path from 'path';
import webpack from 'webpack';
import autoprefixer from 'autoprefixer';

export default {
  cache: true,
  debug: true,
  devtool: 'eval-source-map',

  entry: {
    main: [
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
      },
      {
        test: /\.scss$/,
        include: path.resolve('./src/styles'),
        loaders: [
          'style',
          'css',
          'postcss',
          'sass'
        ]
      },
      {
        test: /\.woff(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.woff2(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/font-woff"
      },
      {
        test: /\.ttf(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=application/octet-stream"
      },
      {
        test: /\.eot(\?v=\d+\.\d+\.\d+)?$/,
        loader: "file"
      },
      {
        test: /\.svg(\?v=\d+\.\d+\.\d+)?$/,
        loader: "url?limit=10000&minetype=image/svg+xml"
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
      $: 'jquery',
      jQuery: 'jquery'
    })
  ],

  postcss() {
    return [ autoprefixer({ browsers: ['last 3 versions'] }) ];
  },

  sassLoader: {
    includePaths: [ path.resolve('node_modules') ]
  },

  resolve: {
    extensions: ['', '.js', '.scss'],
    modulesDirectories: [
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
