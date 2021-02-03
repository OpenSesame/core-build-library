const util = require("util");
const { Command, flags } = require("@oclif/command");
const JSONStream = require("JSONStream");
const es = require("event-stream");
const exec = util.promisify(require("child_process").exec);
const chalk = require("chalk");
const { clear } = require("console");

class PublishStaticWebsiteCommand extends Command {
  async run() {
    const { flags } = this.parse(PublishStaticWebsiteCommand);

    const retrieveInput = new Promise((resolve, reject) => {
      process.stdin.resume();
      process.stdin.setEncoding("utf8");
      process.stdin
        .pipe(JSONStream.parse(/origin_bucket|cloudfront_distribution/g))
        .pipe(
          es.mapSync(async ({ origin_bucket, cloudfront_distribution }) => {
            const originBucketName = origin_bucket.value.bucket;
            const cloudfrontDistribution = cloudfront_distribution.value.id;
            resolve({ originBucketName, cloudfrontDistribution });
          })
        );
    });

    const { originBucketName, cloudfrontDistribution } = await retrieveInput;

    const s3SyncCommand = `aws s3${flags.profile ? ` --profile ${flags.profile}` : ''} sync ${flags.localDir} s3://${originBucketName}`;
    const clearCacheCommand = `aws cloudfront${flags.profile ? ` --profile ${flags.profile}` : ''} create-invalidation --distribution-id ${cloudfrontDistribution} --paths \"/*\"`;

    console.log(chalk.bold(`\nUploading ${flags.localDir} to S3 bucket:`));
    console.log(s3SyncCommand, "\n");
    await exec(s3SyncCommand);

    console.log(chalk.bold(`Flushing Cloudfront distribution:`));
    console.log(clearCacheCommand, "\n");
    await exec(clearCacheCommand);

    console.log(chalk.green("Operation successful.\n"));
  }
}

PublishStaticWebsiteCommand.description =
  "Upload static website files to an existing S3 bucket, and flush the Cloudfront cache. Requires terraform output to be piped in.";

PublishStaticWebsiteCommand.flags = {
  localDir: flags.string({
    char: "d",
    description: "The local dir to upload to the S3 bucket.",
  }),
  profile: flags.string({
    char: "p",
    description: "AWS Profile"
  })
};

module.exports = PublishStaticWebsiteCommand;
