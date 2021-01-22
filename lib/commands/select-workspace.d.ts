import { Command, flags } from '@oclif/command';
export default class SelectWorkspace extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        workspace: flags.IOptionFlag<string | undefined>;
    };
    run(): Promise<void>;
}
