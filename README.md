core-build-library
==================

Core Build Commands

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
- [core-build-library](#core-build-library)
- [Usage](#usage)
- [Commands](#commands)
  - [`core-build build-secrets`](#core-build-build-secrets)
  - [`core-build help [COMMAND]`](#core-build-help-command)
  - [`core-build select-workspace`](#core-build-select-workspace)

## `core-build build-secrets`

Output AWS secrets as environment variable assignments using secrets-map.json

```
USAGE
  $ core-build build-secrets

OPTIONS
  -h, --help             show CLI help
  -m, --mapfile=mapfile  [default: ./secrets-map.json] path to secrets-map.json file
  -p, --profile=profile  name of aws profile
  -r, --region=region    [default: us-west-1] aws region
```

_See code: [src/commands/build-secrets.js](https://github.com/opensesame/core-build-library/blob/v1.0.0/src/commands/build-secrets.js)_

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

## `core-build select-workspace`

Select a terraform workspace, or create it if it does not exist. If workspace name is not provided, use the current git branch.

```
USAGE
  $ core-build select-workspace

OPTIONS
  -h, --help                 show CLI help

  -w, --workspace=workspace  workspace name. If not provided, the current git branch will be used (minus the part before
                             a / character)
```

_See code: [src/commands/select-workspace.js](https://github.com/opensesame/core-build-library/blob/v1.0.0/src/commands/select-workspace.js)_
<!-- commandsstop -->
