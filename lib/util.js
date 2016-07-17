'use strict';

var util = function() {
  /**
   *  sets a value within a deeply nested object using "dot" notation
   */
  function setObj(obj, key, val) {
    let k = key;
    if(k.indexOf('.') > -1) {
      let segments = key.split('.');
      k = segments.pop();

      segments.forEach((k) => {
        if(! obj.hasOwnProperty(k)) {
          obj[k] = {};
        }
        obj = obj[k];
      });
    }
    if(typeof val !== 'undefined') {
      obj[k] = val;
    } else {
      delete obj[k];
    }
  }
  /**
   * retrieves a value from a deeply nested object using "dot" notation
   */
  function getObj(obj, key, def) {
    let k = key;
    if(k.indexOf('.') > -1) {
      let segments = key.split('.');
      k = segments.pop();

      segments.forEach((k) => {
        if(! obj.hasOwnProperty(k)) {
          obj = false;
          return false;
        }
        obj = obj[k];
      });
    }
    return obj ? (typeof obj[k] !== 'undefined' ? obj[k] : def) : def;
  }
  return { setObj, getObj };
}();

module.exports = util;
