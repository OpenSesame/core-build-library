const util = require('util');
const chalk = require("chalk");
const path = require('path');
const exists = util.promisify(require('fs').exists);
const { Command, flags } = require("@oclif/command");

class GenEnvCommand extends Command {
  async run() {
    const { flags } = this.parse(GenEnvCommand);
    const filePath = path.join(process.cwd(), flags.templateFile);

    if (!(await exists(filePath))) {
      this.warn(`No template file found at ${filePath}`);
      return;
    }

    console.log(flags);
    console.log(chalk.green("Operation successful.\n"));
  }
}

GenEnvCommand.description =
  "Template .env files with values from AWS Secrets, AWS SSM, and environment variables";

GenEnvCommand.flags = {
  templateFile: flags.string({
    char: "f",
    description: "The file to template.",
    default: ".env.tpl"
  }),
  profile: flags.string({
    char: "p",
    description: "AWS Profile",
  }),
};

module.exports = GenEnvCommand;

// class GenEnvCommand extends Command {
//   async run() {
//     const { flags } = this.parse(GenEnvCommand);

//     const filePath = path.join(process.cwd(), flags.templateFile);

//     var rd = readline.createInterface({
//         input: fs.createReadStream(filePath),
//         output: process.stdout,
//         console: false
//     });

//     rd.on('line', function(line) {
//         console.log(line);
//     });

//     console.log(chalk.green("Operation successful.\n"));
//   }
// }
