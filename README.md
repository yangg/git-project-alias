# git-shortcut

[![Build Status](https://travis-ci.org/yangg/git-shortcut.svg?branch=master)](https://travis-ci.org/yangg/git-shortcut) [![Dependency Status](https://david-dm.org/yangg/git-shortcut.svg)](https://david-dm.org/yangg/git-shortcut)

git 命令行下直接操作其它项目

## Install
```bash
npm install -g git-shortcut
```

## Usage

```
# add alias
g -s b ../blog
g -s d ../dotfiles
# 使用别名直接操作其它项目
# use alias
g b pull
g d log
# 没有别名匹配时，g 相当于 git 的别名，直接对当前项目操作
# work as a alias for git if not alias matched
g push

# 特殊别名 -，用于常切换于两个 repo 时，操作相对应的另一个项目
cd ../main
g -s - ../static
g - pull
cd ../static
# show status of main
g - status
```

### Remove alias
```bash
g -s b ''
```

### Config file
`~/.git-shortcut.yml`


## License
MIT
