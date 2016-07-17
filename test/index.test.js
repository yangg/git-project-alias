
var assert = require('chai').assert;
var rewire = require("rewire");
var Path   = require('path');

var config = require('../config');

var shortcut = rewire('../');
var realExecFileSync = require('child_process').execFileSync;

describe('git shortcut', function() {
  shortcut.__set__("execFile", function(file, args) {
    if(args && args[0] == 'rev-parse') {
      return realExecFileSync(file, args);
    }
    return args;
  });

  describe('options', function() {
    describe('# set alias', function() {
      it('should add alias', function() {
        shortcut(['-s', 'b', '__repo__']);
        assert.equal(config.get('alias.b'), Path.resolve('__repo__'));

        shortcut(['-s', 'c', '.']);
        assert.equal(config.get('alias.c'), Path.resolve('.'));
      });

      it('should show alias', function() {
        shortcut(['-s', 'b']);
        // assert(config.get('alias.b'), '__repo__');
      });

      it('should remove alias', function() {
        shortcut(['-s', 'b', '']);
        assert.isUndefined(config.get('alias.b'));
      });
    });

    describe('# work with alias', function() {
      it('should operate other repo', function() {
        assert.deepEqual(shortcut(['c', 'log']), ['-C', Path.resolve('.'), 'log']);
      });

      it('should work as a alias for git if no alias matched', function() {
        assert.deepEqual(shortcut(['log']), ['log']);
      })
    });
  });
});
