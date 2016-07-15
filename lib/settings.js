'use strict';

const yaml  = require('js-yaml');
const fs    = require('fs');
const Path  = require('path');

var util = require('./util');

class Settings {
  constructor() {
    let confDir = process.env['HOME'] || process.env['USERPROFILE'];
    this.configPath = Path.join(confDir, '.git-shortcuts.yml');
    this.init();
  }
  init() {
    let config;
    try {
      if(fs.existsSync(this.configPath)) {
        config = yaml.safeLoad(fs.readFileSync(this.configPath));
      }
    } catch (e) {
    }
    this.config = Object.assign({
        default_cmd: 'status'
    }, config);
  }
  get(key, def) {
    return util.getObj(this.config, key, def);
  }
  set(key, val) {
    util.setObj(this.config, key, val);
    this.save();
  }
  save(debounce = true) {
    clearTimeout(this._timer);
    this._timer = setTimeout(() => {
      fs.writeFileSync(this.configPath, yaml.safeDump(this.config));
    }, debounce ? 500 : 0);
  }
}

module.exports = Settings;
