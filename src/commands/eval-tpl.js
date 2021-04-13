const util = require('util');
const chalk = require('chalk');
const path = require('path');
const fs = require('fs');
const readline = require('readline');
const stream = require('stream');
const exec = util.promisify(require('child_process').exec);
const exists = util.promisify(require('fs').exists);
const { Command, flags } = require('@oclif/command');

class EvalTplCommand extends Command {
  async run() {
    const { flags } = this.parse(EvalTplCommand);
    const rules = buildRules(flags.profile);

    const filePath = path.join(process.cwd(), flags.templateFile);
    if (!filePath.endsWith('.tpl')) {
      throw new Error('File must end in .tpl');
    }
    if (!(await exists(filePath))) {
      throw new Error(`No template file found at ${filePath}`);
    }

    const outFile = filePath.slice(0, -4);
    if (await exists(outFile)) {
      await fs.promises.unlink(outFile);
    }

    const input = fs.createReadStream(filePath);
    for await (const inputLine of readLines({ input })) {
      let line = inputLine;
      for (const rule of rules) {
        const regex = new RegExp(rule.pattern, 'g');
        let matches = [...line.matchAll(regex)];
        // Go through the matches in reverse order, so the match
        // indices remain valid after each replacmeent
        for (let match of matches.reverse()) {
          const replacementValue = await rule.apply(match.groups);
          line = line.substr(0, match.index) + replacementValue + line.substr(match.index + match[0].length);
        }
      }

      await fs.promises.appendFile(outFile, `${line}\n`);
    }

    console.log(chalk.green(`Generated ${outFile} from template`));
  }
}

// https://medium.com/@wietsevenema/node-js-using-for-await-to-read-lines-from-a-file-ead1f4dd8c6f
function readLines({ input }) {
  const output = new stream.PassThrough({ objectMode: true });
  const rl = readline.createInterface({ input });
  rl.on('line', (line) => {
    output.write(line);
  });
  rl.on('close', () => {
    output.end();
  });
  return output;
}

function stringifyJSON(value) {
  try {
    // Stringify value if JSON because we cannot write JSON to a file
    const stringifiedVal = JSON.stringify(value);
    return stringifiedVal;
  } catch (e) {
      return value;
  }
}

function buildRules(awsProfile) {
  const profileFlag = awsProfile ? `--profile ${awsProfile}` : '';
  return [
    {
      pattern: /\$\{(?<variable>.*?)\}/,
      apply: async ({ variable }) => {
        const value = process.env[variable];
        if (!value) {
          throw new Error(`Env var ${variable} not found`);
        }
        return value;
      },
    },
    {
      pattern: /\{\{\s*aws_secret:(?<secretId>.*?):(?<secretKey>.*?)\s*\}\}/,
      apply: async ({ secretId, secretKey }) => {
        const stdout = (
          await exec(`aws secretsmanager get-secret-value --secret-id ${secretId} ${profileFlag}`)).stdout;
        const secrets = JSON.parse(JSON.parse(stdout).SecretString);
        const value = secrets[secretKey];
        if (!value) {
          throw new Error('Secret not found');
        }
        return stringifyJSON(value);
      },
    },
    {
      pattern: /\{\{\s*aws_ssm_param:(?<paramKey>.*?)\s*\}\}/,
      apply: async ({ paramKey }) => {
        const stdout = (
          await exec(`aws ssm get-parameter --name ${paramKey} --with-decryption ${profileFlag}`)).stdout;
        const value = JSON.parse(stdout).Parameter.Value;
        if (!value) {
          throw new Error('SSM Parameter not found');
        }
        return stringifyJSON(value);
      },
    },
  ];
}

EvalTplCommand.description = 'Evaluates template (.tpl) files with values from AWS Secrets, AWS SSM, and environment variables.';

EvalTplCommand.flags = {
  help: flags.help({ char: 'h' }),
  templateFile: flags.string({
    char: 'f',
    description: 'The template file to evaluate. Must end in .tpl',
    default: '.env.tpl',
  }),
  profile: flags.string({
    char: 'p',
    description: 'AWS Profile'
  }),
};

module.exports = EvalTplCommand;
