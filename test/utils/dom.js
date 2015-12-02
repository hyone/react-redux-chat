'use strict';

const jsdom = require('jsdom')

// setup the simplest document possible
const doc = jsdom.jsdom('<!doctype html><html><body></body></html>');
const win = doc.defaultView;
global.document = doc;
global.window = win;

// Take all properties of the window object and also attach it to mocha global object.
//
// The reason that we want to attach all the window properties to the mocha global object
// is because developers often write code that is meant for the browser
// without explicitly using the global environment object.
// For instance, in React the developers write:
//
//   navigator.userAgent.indexOf('Chrome') > -1
//
// instead of:
//
//   window.navigator.userAgent.indexOf('Chrome') > -1
//
propagateToGlobal(win);

// from mocha-jsdom
// https://github.com/rstacruz/mocha-jsdom/blob/master/index.js#L80
function propagateToGlobal(window) {
  for (let key in window) {
    if (!window.hasOwnProperty(key)) continue;
    if (key in global) continue;

    global[key] = window[key];
  }
}
