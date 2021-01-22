"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const command_1 = require("@oclif/command");
const util = require("util");
const exec = util.promisify(require('child_process').exec);
class BuildSecrets extends command_1.Command {
    async run() {
        const { flags } = this.parse(BuildSecrets);
        const secretsMap = require(flags.map);
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
exports.default = BuildSecrets;
BuildSecrets.description = 'Output AWS secrets as environment variable assignments using secrets-map.json';
BuildSecrets.flags = {
    help: command_1.flags.help({ char: 'h' }),
    region: command_1.flags.string({ char: 'r', description: 'aws region', default: 'us-west-1' }),
    profile: command_1.flags.string({ char: 'p', description: 'name of aws profile' }),
    map: command_1.flags.string({ char: 'm', description: 'path to secrets-map.json file', default: './secrets-map.json' }),
    output: command_1.flags.string({ char: 'o', description: 'path to output .env file', default: '.env' }),
};
