import { Command, flags } from '@oclif/command';
export default class BuildSecrets extends Command {
    static description: string;
    static flags: {
        help: import("@oclif/parser/lib/flags").IBooleanFlag<void>;
        region: flags.IOptionFlag<string>;
        profile: flags.IOptionFlag<string | undefined>;
        map: flags.IOptionFlag<string>;
        output: flags.IOptionFlag<string>;
    };
    run(): Promise<void>;
}
