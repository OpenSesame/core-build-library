const util = require('util');
const currentBranch = require('current-git-branch');
const exec = util.promisify(require('child_process').exec);
const {Command, flags} = require('@oclif/command');

class NamePrefixCommand extends Command {
  async run() {
    const {flags} = this.parse(NamePrefixCommand);
    const branch = currentBranch();
    const name = flags.name || branch.split('/').slice(-1)[0];
    const namePrefix = name.substring(0, flags.length);
    return namePrefix;
  }
}

NamePrefixCommand.description = 'Calculates the name prefix. If a name is not provided, use the current git branch. Length defaults to 24 characters.'

NamePrefixCommand.flags = {
  help: flags.help({char: 'h'}),
  name: flags.string({char: 'n', description: 'name. If not provided, the current git branch will be used (minus the part before a / character)'}),
  length: flags.integer({char: 'l', description: 'length of the name prefix', default: 24})
}

module.exports = NamePrefixCommand;
