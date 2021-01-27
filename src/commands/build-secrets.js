const util = require('util');
const path = require('path');
const exec = util.promisify(require('child_process').exec);
const {Command, flags} = require('@oclif/command');

class BuildSecretsCommand extends Command {
  async run() {
    const {flags} = this.parse(BuildSecretsCommand);
    const secretsMap = require(path.join(process.cwd(), flags.mapfile));
    const profileFlag = flags.profile ? `--profile ${flags.profile}` : '';

    for (const secretId of Object.keys(secretsMap)) {
      const stdout = (await exec(`aws ${profileFlag} secretsmanager get-secret-value --secret-id ${secretId}`)).stdout;
      const secrets = JSON.parse(JSON.parse(stdout).SecretString);
      const envMap = secretsMap[secretId];
      for (const fieldName of Object.keys(envMap)) {
          const secretValue = secrets[fieldName];
          const varName = envMap[fieldName];
          this.log(`${varName}=${secretValue}`);
      }
    }
  }
}

BuildSecretsCommand.description = `Output AWS secrets as environment variable assignments using secrets-map.json`

BuildSecretsCommand.flags = {
  help: flags.help({char: 'h'}),
  region: flags.string({char: 'r', description: 'aws region', default: 'us-west-1'}),
  profile: flags.string({char: 'p', description: 'name of aws profile'}),
  mapfile: flags.string({char: 'm', description: 'path to secrets-map.json file', default: './secrets-map.json'})
}

module.exports = BuildSecretsCommand;
