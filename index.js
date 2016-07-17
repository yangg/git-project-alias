#!/usr/bin/env node
'use strict';

const Path  = require('path');
var execFile = require('child_process').execFileSync;

const config = require('./config');
const DEBUG = !!process.env.DEBUG;

DEBUG && console.log(process.argv.slice(2));
function entry( argv ) {
  argv = argv || process.argv.slice(2) ;
  if(!argv.length) {
    return printHelp();
  }
  let alias = argv.shift();
  let aliases = config.get('alias');

  if(aliases.hasOwnProperty(alias) || alias == '-') {
    // resolve alias map
    let cwd = getGitDir();
    let nwd = alias == '-' ? config.get('-.' + cwd) :  aliases[alias]; // new working directory
    if(!nwd) {
      process.stderr.write(`No alias \`${alias}' set for \`${cwd}'\n`);
      return printHelp();
    }
    process.stdout.write(`Working directory changed to \`${nwd}'\n`)
    argv.unshift('-C', nwd);

    // no more arguments, run 'git <default_cmd>'
    if(argv.length == 2) {
      argv.push(config.get('default_cmd'));
    }
  } else if(alias[0] == '-') { // start with `-'
    // options
    return resolveOptions(alias, argv);
  } else {
    // call git <cmd>
    argv.unshift(alias);
  }
  DEBUG && console.log(argv);
  try {
    return execFile(config.get('git_cmd'), argv, { stdio: 'inherit' });
  } catch(ex) {
  }
}

function resolveOptions(option, argv) {
  // set alias
  if(option == '-s' || option == '--set') {
    let name = argv[0], path = argv[1];
    if(!name) {
      return printHelp();
    }
    // special alias `-'
    if(name == '-') {
      let cwd = getGitDir();
      if(path) { // set
        path = Path.resolve(path);
        config.set('-.' + cwd, path);
        if(!config.get('-.' + path)) {
          config.set('-.' + path, cwd);
        }
      } else if(typeof path == 'undefined') { // print
        path = config.get('-.' + cwd);
        if(path) {
          process.stdout.write(`\`-' is aliased to \`${path}'\n`);
        } else {
          process.stderr.write("Cannot find alias `-'\n");
          printHelp();
        }
      } else if(path === '') {
        config.set('-.' + cwd);
      }
    } else if(path) {
      // add alias
      path = Path.resolve(path);
      config.set('alias.' + name, path);
      process.stdout.write(`Saved alias \`${name}' to \`${path}'\n`);
    } else if(typeof path == 'undefined') {
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
      process.stdout.write(`Removed alias \`${name}'!\n`);
    }
  } else {
    printHelp();
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
  let helpInfo = `Usage:
  git-shortcut [alias] <git commands>
  git-shortcut [<options>...]
Options:
 -s, --set    set alias
  example:
   git -s b ../blog
   git b pull
`;
  console.log(helpInfo);
}

if (require.main === module) {
  entry();
} else {
  module.exports = entry;
}
