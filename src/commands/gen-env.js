const util = require("util");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const readline = require("readline");
const exec = util.promisify(require("child_process").exec);
const exists = util.promisify(require("fs").exists);
const { Command, flags } = require("@oclif/command");

class GenEnvCommand extends Command {
  async run() {
    const { flags } = this.parse(GenEnvCommand);
    const filePath = path.join(process.cwd(), flags.templateFile);
    const outFile = filePath.slice(0, -4);
    const awsProfile = flags.profile;
    const rules = [
      {
        pattern: /\$\{(?<variable>.*?)\}/,
        replacer: async ({ variable }) => {
          const value = process.env[variable];
          if (!value) {
            throw "Env var not found";
          }
          return value;
        },
      },
      {
        pattern: /\{\{\s*aws_secret:(?<secretId>.*?):(?<secretKey>.*?)\s*\}\}/,
        replacer: async ({ secretId, secretKey }) => {
          const stdout = (
            await exec(
              `aws secretsmanager get-secret-value --secret-id ${secretId} --profile ${awsProfile}`
            )
          ).stdout;
          const secrets = JSON.parse(JSON.parse(stdout).SecretString);
          const value = secrets[secretKey];
          if (!value) {
            throw "Secret not found";
          }
          return value;
        },
      },
      {
        pattern: /\{\{\s*aws_ssm_param:(?<paramKey>.*?)\s*\}\}/,
        replacer: async ({ paramKey }) => {
          const stdout = (
            await exec(
              `aws ssm get-parameter --name ${paramKey} --with-decryption --profile ${awsProfile}`
            )
          ).stdout;
          const value = JSON.parse(stdout).Parameter.Value;
          if (!value) {
            throw "SSM Parameter not found";
          }
          return value;
        },
      },
    ];

    if (!(await exists(filePath))) {
      this.warn(`No template file found at ${filePath}`);
      return;
    }

    const rd = readline.createInterface({
      input: fs.createReadStream(filePath),
      console: false,
    });

    rd.on("line", async function (line) {
      let lineCpy = line;
      for await (const rule of rules) {
        let match = lineCpy.match(rule.pattern);
        while (match !== null) {
          const replacementValue = await rule.replacer(match.groups);
          lineCpy = lineCpy.substr(0, match.index) + replacementValue + lineCpy.substr(match.index + match[0].length);
          match = lineCpy.match(rule.pattern);
        }

        fs.writeFile(outFile, lineCpy + '\n', {'flag':'a'}, function (err) {
          if (err) return console.log(err);
        });
      }
    });

    console.log(chalk.green("Operation successful.\n"));
  }
}

GenEnvCommand.description =
  "Template .env files with values from AWS Secrets, AWS SSM, and environment variables";

GenEnvCommand.flags = {
  templateFile: flags.string({
    char: "f",
    description: "The file to template.",
    default: ".env.tpl",
  }),
  profile: flags.string({
    char: "p",
    description: "AWS Profile",
    default: "default",
  }),
};

module.exports = GenEnvCommand;
