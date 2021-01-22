import {Command, flags} from '@oclif/command'
import * as util from 'util';
import {join} from 'path';
const exec = util.promisify(require('child_process').exec);

export default class BuildSecrets extends Command {
  static description = 'Output AWS secrets as environment variable assignments using secrets-map.json'

  static flags = {
    help: flags.help({char: 'h'}),
    region: flags.string({char: 'r', description: 'aws region', default: 'us-west-1'}),
    profile: flags.string({char: 'p', description: 'name of aws profile'}),
    mapfile: flags.string({char: 'm', description: 'path to secrets-map.json file', default: './secrets-map.json'})
  }

  async run() {
    const {flags} = this.parse(BuildSecrets);
    const secretsMap = require(join(process.cwd(), flags.mapfile));
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
