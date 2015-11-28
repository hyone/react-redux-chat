import autoprefixer         from 'autoprefixer';
import browserSync          from 'browser-sync';
import del                  from 'del';
import eslint               from 'gulp-eslint';
import gulp                 from 'gulp';
import gutil                from 'gulp-util';
import header               from 'gulp-header';
import historyApi           from 'connect-history-api-fallback';
import inject               from 'gulp-inject';
import postcss              from 'gulp-postcss';
import sass                 from 'gulp-sass';
import webpack              from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';


const paths = {
  src: {
    html: 'src/**/*.html',
    js: 'src/**/*.js',
    sass: 'src/styles/**/*.scss',
    fonts: {
      files: 'node_modules/bootstrap-sass/assets/fonts/**/*',
      base:  'node_modules/bootstrap-sass/assets'
    }
  },
  target: 'dist'
};

const config = {
  autoprefixer: {
    browsers: ['last 3 versions']
  },

  browserSync: {
    files: [ `${paths.target}/**/!(*.js)` ],
    notify: false,
    open: false,
    port: 7000,
    reloadDelay: 1200,
    reloadOnRestart: true,
    server: {
      baseDir: paths.target
    }
  },

  eslint: {
    src: paths.src.js
  },

  header: {
    src: paths.target + '/*.{css,js}',
    template: '/* <%= name %>@<%= version %> - <%= date %> - <%= url %> */\n'
  },

  inject: {
    src: 'dist/index.html',
    includes: [
      'dist/vendor.js'
    ],
    options: { relative: true }
  },

  sass: {
    errLogToConsole: true,
    outputStyle: 'nested',
    precision: 10,
    sourceComments: false,
    includePaths: [
      './node_modules/bootstrap-sass/assets/stylesheets/',
      './node_modules/bootcards/src/css/'
    ]
  },

  webpack: {
    development: './webpack.config.development.babel',
    production: './webpack.config.production.babel'
  }
};

gulp.task('clean', () =>
  del(paths.target)
);

gulp.task('copy:fonts', () => {
  const { files, base } = paths.src.fonts;
  return gulp.src(files, { base: base })
    .pipe(gulp.dest(paths.target));
});

gulp.task('copy:html', () =>
  gulp.src(paths.src.html)
    .pipe(gulp.dest(paths.target))
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
    .pipe(gulp.dest(paths.target));
});

gulp.task('inject', () => {
  return gulp.src(config.inject.src)
    .pipe(inject(
      gulp.src(config.inject.includes, { read: false }),
      config.inject.options
    ))
    .pipe(gulp.dest(paths.target));
});

gulp.task('js', (done) => {
  const webpackConfig = require(config.webpack.production);
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

gulp.task('css', () => {
  return gulp.src(paths.src.sass)
    .pipe(sass(config.sass))
    .pipe(postcss([
      autoprefixer(config.autoprefixer)
    ]))
    .pipe(gulp.dest(paths.target));
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


gulp.task('build', gulp.series(
  'clean',
  'copy:html',
  'copy:fonts',
  'css'
));

gulp.task('watch:development', gulp.series(
  'build',
  'serve:development',
  () => {
    gulp.watch(paths.src.html, gulp.task('copy:html'));
    gulp.watch(paths.src.sass, gulp.task('css'));
  }
));

gulp.task('dist', gulp.series(
  'lint',
  'build',
  'js',
  'inject',
  'headers'
));

gulp.task('run', gulp.series('watch:development'));
gulp.task('default', gulp.series('run'));
