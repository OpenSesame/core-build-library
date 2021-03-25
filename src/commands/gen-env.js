const {Command, flags} = require('@oclif/command');

class GenEnvCommand extends Command {
  async run() {
    const {flags} = this.parse(GenEnvCommand);
    console.log(flags)
  }
}

GenEnvCommand.description =
  "Template .env files with values from AWS Secrets, AWS SSM, and environment variables";

  GenEnvCommand.flags = {
  templateFile: flags.string({
    char: "f",
    description: "The file to template.",
  }),
  profile: flags.string({
    char: "p",
    description: "AWS Profile"
  })
};

module.exports = GenEnvCommand;

// const util = require("util");
// const { Command, flags } = require("@oclif/command");
// const JSONStream = require("JSONStream");
// const es = require("event-stream");
// const chalk = require("chalk");
// const { clear } = require("console");
// const {fs, exists } = require('fs');
// const readline = require('readline');
// const util = require('util');
// const path = require('path');
// const exec = util.promisify(require('child_process').exec);
// const exists = util.promisify(require('fs').exists);

// class GenEnvCommand extends Command {
//   async run() {
//     const { flags } = this.parse(GenEnvCommand);

//     const filePath = path.join(process.cwd(), flags.templateFile);
    
//     if (!await exists(filePath)) {
//       this.warn(`No template file found at ${filePath}`);
//       return;
//     }

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

