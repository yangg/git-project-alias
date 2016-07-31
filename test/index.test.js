'use strict';
/* eslint-env mocha */

const assert = require('chai').assert;
const Path   = require('../lib/path');

const config = require('../config');
config.configPath = Path.join(require('os').tmpdir(), 'git-shortcut.yml');

var Shortcut = require('../');
// var execFileSync = require('child_process').execFileSync;

describe('git shortcut', function() {

  describe('options', function() {
    let repoPath = Path.resolve('.');
    let repoRelated = Path.resolve('__repo__');
    describe('# set alias', function() {
      it('should add alias', function() {
        new Shortcut(['-s', 'b', '__repo__']);
        assert.equal(config.get('alias.b'), repoRelated);

        new Shortcut(['-s', 'c', '.']);
        assert.equal(config.get('alias.c'), repoPath);

        new Shortcut(['-s', '-', '__repo__']);
        assert.equal(config.get('-.' + repoPath), repoRelated, "Alias `-'");
      });

      it('should show alias', function() {
        new Shortcut(['-s', 'b']);
      });

      it('should remove alias', function() {
        new Shortcut(['-s', 'b', '']);
        assert.isUndefined(config.get('alias.b'));
      });
    });

    describe('# work with alias', function() {
      it('should alias is a folder', function() {
        let shortcut = new Shortcut(['.', 'log']);
        assert.deepEqual(shortcut.args, ['-C', repoPath, 'log']);
      });

      it('should operate other repo', function() {
        let shortcut = new Shortcut(['c', 'log'])
        assert.deepEqual(shortcut.args, ['-C', repoPath, 'log']);
      });

      it('should operate related repo', function() {
        let shortcut = new Shortcut(['-', 'log'])
        assert.deepEqual(shortcut.args, ['-C', repoRelated, 'log']);
      });

      it('should work as a alias for git if no alias matched', function() {
        let shortcut = new Shortcut(['log']);
        assert.deepEqual(shortcut.args, ['log']);
      });
    });
  });
});
