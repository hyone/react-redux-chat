import browserSync          from 'browser-sync';
import del                  from 'del';
import eslint               from 'gulp-eslint';
import glob                 from 'glob';
import gulp                 from 'gulp';
import gutil                from 'gulp-util';
import header               from 'gulp-header';
import historyApi           from 'connect-history-api-fallback';
import inject               from 'gulp-inject';
import mocha                from 'gulp-spawn-mocha';
import path                 from 'path';
import webpack              from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

const paths = {
  src: {
    html: 'src/**/*.html',
    js: 'src/**/*.js',
    test: 'test/**/*.spec.js'
  },
  dest: {
    target: 'dist',
    testTarget: './tmp/testBundle.js'
  }
};

const config = {
  browserSync: {
    files: [ `${paths.dest.target}/**/!(*.js)` ],
    notify: false,
    open: false,
    port: 7000,
    reloadDelay: 1200,
    reloadOnRestart: true,
    server: {
      baseDir: paths.dest.target
    }
  },

  eslint: {
    src: paths.src.js
  },

  header: {
    src: paths.dest.target + '/*.{js}',
    template: '/* <%= name %>@<%= version %> - <%= date %> - <%= url %> */\n'
  },

  inject: {
    src: 'dist/index.html',
    includes: [
      'dist/vendor.js'
    ],
    options: {
      addRootSlash: true,
      relative: true
    }
  },

  mocha: {
    require: [ path.resolve('./test/utils/dom.js') ],
    reporter: 'spec'
  },

  webpack: {
    development: './webpack.config.development.babel',
    test: './webpack.config.test.babel',
    production: './webpack.config.production.babel'
  }
};

gulp.task('clean', () =>
  del([paths.dest.target, paths.dest.testTarget])
);

gulp.task('copy:html', () =>
  gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.dest.target))
);

gulp.task('headers', () => {
  const pkg = require('./package.json');
  const params = {
    date: (new Date()).toISOString(),
    name: pkg.name,
    version: pkg.version,
    url: pkg.homepage
  };
  return gulp.src(config.header.src)
    .pipe(header(config.header.template, params))
    .pipe(gulp.dest(paths.dest.target));
});

gulp.task('inject', () => {
  return gulp.src(config.inject.src)
    .pipe(inject(
      gulp.src(config.inject.includes, { read: false }),
      config.inject.options
    ))
    .pipe(gulp.dest(paths.dest.target));
});

gulp.task('webpack', (done) => {
  const configFile = process.env.NODE_ENV === 'production'
                       ? config.webpack.production
                       : config.webpack.development;
  const webpackConfig = require(configFile);
  webpack(webpackConfig).run((error, stats) => {
    if (error) throw new gutil.PluginError('webpack', error);
    gutil.log(stats.toString(webpackConfig.stats));
    done();
  });
});

gulp.task('webpack:development', gulp.series(
  (done) => {
    process.env.BABEL_ENV = 'development';
    process.env.NODE_ENV  = 'development';
    done()
  },
  'webpack'
));

gulp.task('webpack:production', gulp.series(
  (done) => {
    process.env.BABEL_ENV = 'production';
    process.env.NODE_ENV  = 'production';
    done()
  },
  'webpack'
));

gulp.task('webpack:test', (done) => {
  process.env.BABEL_ENV = 'test';

  const configFile = config.webpack.test;
  const webpackConfig = {
    ...require(configFile),
    entry: glob.sync(paths.src.test).map((p) => `./${p}`),
    output: {
      filename: path.basename(paths.dest.testTarget),
      path: path.dirname(paths.dest.testTarget)
    }
  };
  webpack(webpackConfig).run((error, stats) => {
    if (error) throw new gutil.PluginError('webpack', error);
    gutil.log(stats.toString(webpackConfig.stats));
    done();
  });
});

gulp.task('lint', () => {
  return gulp.src(config.eslint.src)
    .pipe(eslint())
    .pipe(eslint.format())
    .pipe(eslint.failAfterError());
});

gulp.task('serve', (done) => {
  config.browserSync.server.middleware = [
    historyApi()
  ];
  browserSync.create()
    .init(config.browserSync, done);
});

gulp.task('serve:development', (done) => {
  const webpackConfig = require(config.webpack.development);
  const compiler = webpack(webpackConfig);
  config.browserSync.server.middleware = [
    webpackDevMiddleware(compiler, { stats: webpackConfig.stats }),
    webpackHotMiddleware(compiler),
    historyApi()
  ];
  browserSync.create()
    .init(config.browserSync, done);
});


gulp.task('prepare', gulp.series(
  'clean',
  'copy:html',
));

gulp.task('mocha', (done) => {
  gulp.src(paths.dest.testTarget, { read: false })
    .pipe(mocha(config.mocha))
    .on('error', (error) => {
      gutil.log(error);
    })
    .once('end', () => {
      done();
    })
});

gulp.task('test', gulp.series(
  'webpack:test',
  'mocha'
));

gulp.task('watch:development', gulp.series(
  'prepare',
  'serve:development',
  () => {
    gulp.watch(paths.src.html, gulp.task('copy:html'));
  }
));

gulp.task('watch:test', () => {
  gulp.watch([ paths.src.js, paths.src.test ], gulp.series('test'));
});

gulp.task('dist', gulp.series(
  'lint',
  'prepare',
  'webpack:production',
  'inject',
  'headers'
));

gulp.task('run', gulp.series('watch:development'));
gulp.task('default', gulp.series('run'));
