'use strict';

const Settings = require('./lib/settings');

const config = new Settings({
  alias: {},
  default_cmd: 'status',
  git_cmd: 'git'
}, '.git-shortcut.yml');

module.exports = config;
