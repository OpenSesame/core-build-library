const util = require('util');
const currentBranch = require('current-git-branch');
const exec = util.promisify(require('child_process').exec);
const {Command, flags} = require('@oclif/command');

class SelectWorkspaceCommand extends Command {
  async run() {
    const {flags} = this.parse(SelectWorkspaceCommand);
    const branch = currentBranch();
    const workspaceName = flags.workspace || branch.split('/').slice(-1)[0];
    const command = `terraform workspace select ${workspaceName} || terraform workspace new ${workspaceName}`;
    await exec(command);
  }
}

SelectWorkspaceCommand.description = `Select a terraform workspace, or create it if it does not exist. If workspace name is not provided, use the current git branch.`

SelectWorkspaceCommand.flags = {
  help: flags.help({char: 'h'}),
  workspace: flags.string({char: 'w', description: 'workspace name. If not provided, the current git branch will be used (minus the part before a / character)'}),
}

module.exports = SelectWorkspaceCommand;
