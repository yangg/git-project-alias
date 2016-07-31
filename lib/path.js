'use strict';

var path = require('path');
var resolve = path.resolve;

/**
 * run path.resolve and normalize separator on windows
 * @param  {String} path
 * @return {String} absolute path
 */
path.resolve = function() {
  return resolve.apply(path, arguments).replace(/\\/g, '/');
};

module.exports = path;
