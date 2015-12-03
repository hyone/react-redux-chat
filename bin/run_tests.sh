#!/bin/sh
#
# Compile and test spec files.
# Useful to run particular spec files

export BABEL_ENV=test
node_modules/.bin/webpack $@ tmp/testBundle.js --config webpack.config.test.babel.js
node_modules/.bin/mocha --opts mocha.opts tmp/testBundle.js
