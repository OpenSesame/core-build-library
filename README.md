core-build-library
==================

Core Build Commands

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

- [`core-build build-secrets`](#core-build-build-secrets)
- [`core-build select-workspace`](#core-build-select-workspace)
- [`core-build eval-tpl`](#core-build-eval-tpl)

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

## `core-build eval-tpl`

Evaluates template (.tpl) files with values from AWS Secrets, AWS SSM, and environment variables.
```
USAGE
  $ core-build eval-tpl

OPTIONS
  -h, --help                       show CLI help
  -f, --templateFile=templateFile  [default: .env.tpl] The template file to evaluate.  Must end in .tpl
  -p, --profile=profile            [default: default] AWS Profile
```
<h3>Rules</h3>

| Rule      | Syntax |
| ----------- | ----------- |
| Environment Variables      | ${\<variable_name>}       |
| AWS Secret   | {{ aws_secret:\<secret_name>:\<json_key> }}        |
| AWS SSM Parameter  | {{ aws_ssm_param:\<ssm_param_name> }}        |

<h3>Notes</h3>

- Each rule will only be evaluated once per line
- Rules are evaluated in a set order (Env variables -> AWS Secret -> AWS SSM Parameter). This means they are supported within each other.



_See code: [src/commands/select-workspace.js](https://github.com/opensesame/core-build-library/blob/v1.0.0/src/commands/select-workspace.js)_
<!-- commandsstop -->