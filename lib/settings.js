'use strict';

const yaml  = require('js-yaml');
const fs    = require('fs');
const Path  = require('path');

var util = require('./util');

class Settings {
  constructor(options, confName, confDir) {
    confDir = confDir || process.env.HOME || process.env.USERPROFILE;
    if(!confName) {
      throw Error('Settings, confName is required');
    }
    this.configPath = Path.join(confDir, confName);
    this.init(options);
  }
  init(options) {
    let config;
    try {
      if(fs.existsSync(this.configPath)) {
        config = yaml.safeLoad(fs.readFileSync(this.configPath));
      }
    } catch (e) {
    }
    this.config = Object.assign(options || {}, config);
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
