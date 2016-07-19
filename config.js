'use strict';

const Settings = require('yaml-settings');

const config = new Settings('.git-shortcut.yml');
config.init({
  alias: {},
  default_cmd: ['status', '-s'],
  git_cmd: 'git'
});

module.exports = config;
