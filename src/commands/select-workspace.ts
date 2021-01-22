import {Command, flags} from '@oclif/command'
import * as currentBranch from 'current-git-branch';
import * as util from 'util';
const exec = util.promisify(require('child_process').exec);

export default class SelectWorkspace extends Command {
  static description = 'Select a terraform workspace, or create it if it does not exist. If workspace name is not provided, use the current git branch.'

  static flags = {
    help: flags.help({char: 'h'}),
    workspace: flags.string({char: 'w', description: 'workspace name. If not provided, the current git branch will be used (minus the part before a / character)'}),
  }

  async run() {
    const {flags} = this.parse(SelectWorkspace)
    const branch = currentBranch() as string;
    const workspaceName = flags.workspace || branch.split('/').slice(-1)[0]
    const command = `terraform workspace select ${workspaceName} || terraform workspace new ${workspaceName}`;
    await exec(command);
  }
}
