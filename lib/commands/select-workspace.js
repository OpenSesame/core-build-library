"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const currentBranch = require("current-git-branch");
const util = require("util");
const exec = util.promisify(require('child_process').exec);
class SelectWorkspace extends command_1.Command {
    async run() {
        const { flags } = this.parse(SelectWorkspace);
        const branch = currentBranch();
        const workspaceName = flags.workspace || branch.split('/').slice(-1)[0];
        const command = `terraform workspace select ${workspaceName} || terraform workspace new ${workspaceName}`;
        await exec(command);
    }
}
exports.default = SelectWorkspace;
SelectWorkspace.description = 'Select a terraform workspace, or create it if it does not exist. If workspace name is not provided, use the current git branch.';
SelectWorkspace.flags = {
    help: command_1.flags.help({ char: 'h' }),
    workspace: command_1.flags.string({ char: 'w', description: 'workspace name. If not provided, the current git branch will be used (minus the part before a / character)' }),
};
