#!/usr/bin/env node
'use strict';
/**
 * git-shortcut
 * helps you quickly run git commands work with multiple repos without switch directory
 * @author Brook Yang https://github.com/yangg/git-shortcut
 */

const fs = require('fs');

const Path  = require('./lib/path');
var execFile = require('child_process').execFileSync;

const config = require('./config');

class Shortcut {
  constructor(argv) {
    if(!(argv && argv.length)) {
      return printHelp();
    }
    let alias = argv.shift();
    this.args = argv;

    // if alias exist, reslove alias
    if(alias[0] !== '-' || alias === '-') {
      this.resolve(alias);
      // if(hasError === false) {
      //   return false;
      // }
    } else if(alias[0] === '-') { // start with `-'
      // options
      this.resolveOptions(alias);
    }
  }
  run() {
    if(!this.args.length) {
      return;
    }
    try {
      return execFile(config.get('git_cmd'), this.args, { stdio: 'inherit' });
    } catch(ex) {
      process.stderr.write(`Git command exit with error\n`);
    }
  }
  resolve(alias) {
    let nwd = Path.resolve(alias); // new working directory
    let cwd;
    try {
      fs.accessSync(nwd); // check if file exist
    } catch(ex) {
      cwd = getGitDir();
      nwd = config.get(alias === '-' ? ['-', cwd] : ('alias.' + alias));
    }

    if(!nwd) {
      // not a exist dir or alias
      // call git <cmd>
      this.args.unshift(alias);
      return;
      // process.stderr.write(`No alias \`${alias}' set for \`${cwd}'\n`);
      // printHelp();
      // return false;
    }
    process.stdout.write(`Working directory changed to \`${nwd}'\n`)
    this.args.unshift('-C', nwd);

    // no more arguments, run 'git <default_cmd>'
    if(this.args.length === 2) {
      this.args = this.args.concat(config.get('default_cmd'));
    }
  }


  resolveOptions(option) {
    // set alias
    switch(option) {
      case '-s':
      case '--set':
        this.addAlias();
        break;
      case '-p':
      case '--parallel':
        this.parallel();
        break;
      case '-v':
      case '--version':
        this.version();
        break;
      default:
        printHelp();
        break;
    }
    this.args.length = 0;
  }

  version() {
    var config = require('./package.json');
    process.stdout.write(`v${config.version}\n`);
  }

  /**
   * 在当前项目和其它项目内 同时执行 git 命令
   * 比如同时需要切换分支或者 pull 时
   * examples:
   * g -p - checkout master
   */
  parallel() {
    var aliases = this.args.shift();
    var gitArgs = this.args;
    this.run();
    aliases.split(',').forEach((alias) => {
      process.stdout.write('\n');
      this.args = gitArgs.concat();
      this.resolve(alias);
      // console.log(this.args);
      this.run();
    });
  }

  addAlias() {
    let name = this.args[0], path = this.args[1];
    if(!name) {
      return printHelp();
    }
    // special alias `-'
    if(name === '-') {
      let cwd = getGitDir();
      if(path) { // set
        path = Path.resolve(path);
        config.set(['-', cwd], path);
        if(!config.get(['-', path])) {
          config.set(['-', path], cwd);
        }
        process.stdout.write(`Saved alias \`-' to \`${path}'\n`);
      } else if(typeof path === 'undefined') { // print
        path = config.get(['-', cwd]);
        if(path) {
          process.stdout.write(`\`-' is aliased to \`${path}'\n`);
        } else {
          process.stderr.write("Cannot find alias `-'\n");
          return printHelp();
        }
      } else if(path === '') {
        config.set(['-', cwd]);
      }
    } else if(path) {
      // add alias
      path = Path.resolve(path);
      config.set('alias.' + name, path);
      process.stdout.write(`Saved alias \`${name}' to \`${path}'\n`);
    } else if(typeof path === 'undefined') {
      // print alias
      path = config.get('alias.' + name);
      if(path) {
        process.stdout.write(`alias.${name} = \`${path}'\n`);
      } else {
        process.stderr.write(`Cannot find alias \`${name}'\n`);
        printHelp();
      }
    } else if(path === '') {
      // delete alias
      config.set('alias.' + name);
      process.stdout.write(`Removed alias \`${name}'\n`);
    }
  }
}

function getGitDir() {
  try {
    let res = execFile(config.get('git_cmd'), ['rev-parse', '--show-toplevel']);
    return res.toString().trim();
  } catch(ex) {
    process.exit(1);
  }
}

function printHelp() {
  let helpInfo = fs.readFileSync(Path.join(__dirname, 'help.txt')).toString();
  console.log(helpInfo);
}

if (require.main === module) {
  new Shortcut(process.argv.slice(2)).run();
} else {
  module.exports = Shortcut;
}
