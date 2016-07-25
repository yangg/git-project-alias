'use strict';

const assert = require('chai').assert;
const rewire = require("rewire");
const Path   = require('../lib/path');

const config = require('../config');
config.configPath = Path.join(require('os').tmpdir(), 'git-shortcut.yml');

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
    let repoPath = Path.resolve('.');
    let repoRelated = Path.resolve('__repo__');
    describe('# set alias', function() {
      it('should add alias', function() {
        shortcut(['-s', 'b', '__repo__']);
        assert.equal(config.get('alias.b'), repoRelated);

        shortcut(['-s', 'c', '.']);
        assert.equal(config.get('alias.c'), repoPath);

        shortcut(['-s', '-', '__repo__']);
        assert.equal(config.get('-.' + repoPath), repoRelated, "Alias `-'");
      });

      it('should show alias', function() {
        shortcut(['-s', 'b']);
      });

      it('should remove alias', function() {
        shortcut(['-s', 'b', '']);
        assert.isUndefined(config.get('alias.b'));
      });
    });

    describe('# work with alias', function() {
      it('should alias is a folder', function() {
        assert.deepEqual(shortcut(['.', 'log']), ['-C', repoPath, 'log']);
      });

      it('should operate other repo', function() {
        assert.deepEqual(shortcut(['c', 'log']), ['-C', repoPath, 'log']);
      });

      it('should operate related repo', function() {
        assert.deepEqual(shortcut(['-', 'log']), ['-C', repoRelated, 'log']);
      });

      it('should work as a alias for git if no alias matched', function() {
        assert.deepEqual(shortcut(['log']), ['log']);
      });
    });
  });
});
