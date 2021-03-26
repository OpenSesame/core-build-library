const util = require("util");
const chalk = require("chalk");
const path = require("path");
const fs = require("fs");
const readline = require("readline");
const stream = require("stream");
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

    if (await exists(outFile)) {
      await fs.promises.unlink(outFile);
    }

    const input = fs.createReadStream(filePath);
    for await (const inputLine of readLines({ input })) {
      let line = inputLine;
      for await (const rule of rules) {
        let match = line.match(rule.pattern);
        if (match !== null) {
          const replacementValue = await rule.replacer(match.groups);
          line = line.substr(0, match.index) + replacementValue + line.substr(match.index + match[0].length);
        }
      }
      await fs.promises.appendFile(outFile, `${line}\n`);
    }
  }
  async catch(error) {
    this.error(error);
  }
}

function readLines({ input }) {
  const output = new stream.PassThrough({ objectMode: true });
  const rl = readline.createInterface({ input });
  rl.on("line", (line) => {
    output.write(line);
  });
  rl.on("close", () => {
    output.push(null);
  });
  return output;
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
