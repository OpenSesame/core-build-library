core-build-library
==================

Core Build Library

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/core-build-library.svg)](https://npmjs.org/package/core-build-library)
[![Downloads/week](https://img.shields.io/npm/dw/core-build-library.svg)](https://npmjs.org/package/core-build-library)
[![License](https://img.shields.io/npm/l/core-build-library.svg)](https://github.com/opensesame/core-build-library/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g core-build-library
$ core-build COMMAND
running command...
$ core-build (-v|--version|version)
core-build-library/1.0.0 win32-x64 node-v12.2.0
$ core-build --help [COMMAND]
USAGE
  $ core-build COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`core-build build-secrets [FILE]`](#core-build-build-secrets-file)
* [`core-build hello [FILE]`](#core-build-hello-file)
* [`core-build help [COMMAND]`](#core-build-help-command)
* [`core-build select-workspace [FILE]`](#core-build-select-workspace-file)

## `core-build build-secrets [FILE]`

describe the command here

```
USAGE
  $ core-build build-secrets [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/build-secrets.ts](https://github.com/opensesame/core-build-library/blob/v1.0.0/src/commands/build-secrets.ts)_

## `core-build hello [FILE]`

describe the command here

```
USAGE
  $ core-build hello [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print

EXAMPLE
  $ core-build hello
  hello world from ./src/hello.ts!
```

_See code: [src/commands/hello.ts](https://github.com/opensesame/core-build-library/blob/v1.0.0/src/commands/hello.ts)_

## `core-build help [COMMAND]`

display help for core-build

```
USAGE
  $ core-build help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.1/src/commands/help.ts)_

## `core-build select-workspace [FILE]`

describe the command here

```
USAGE
  $ core-build select-workspace [FILE]

OPTIONS
  -f, --force
  -h, --help       show CLI help
  -n, --name=name  name to print
```

_See code: [src/commands/select-workspace.ts](https://github.com/opensesame/core-build-library/blob/v1.0.0/src/commands/select-workspace.ts)_
<!-- commandsstop -->
