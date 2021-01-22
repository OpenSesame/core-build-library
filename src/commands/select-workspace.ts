import {Command, flags} from '@oclif/command'

export default class SelectWorkspace extends Command {
  static description = 'describe the command here'

  static flags = {
    help: flags.help({char: 'h'}),
    name: flags.string({char: 'n', description: 'name to print'}),
    force: flags.boolean({char: 'f'}),
  }

  static args = [{name: 'file'}]

  async run() {
    const {args, flags} = this.parse(SelectWorkspace)

    const name = flags.name ?? 'world'
    this.log(`hello ${name} from C:\\OpenSesame\\core-build-library\\src\\commands\\select-workspace.ts`)
    if (args.file && flags.force) {
      this.log(`you input --force and --file: ${args.file}`)
    }
  }
}
