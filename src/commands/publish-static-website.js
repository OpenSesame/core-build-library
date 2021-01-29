const util = require("util");
const { Command, flags } = require("@oclif/command");
const JSONStream = require("JSONStream");
const es = require("event-stream");
const exec = util.promisify(require("child_process").exec);

class PublishStaticWebsiteCommand extends Command {
  async run() {
    const { flags } = this.parse(PublishStaticWebsiteCommand);
    const awsProfileFlag = "--profile core-dev";

    process.stdin.resume();
    process.stdin.setEncoding("utf8");
    process.stdin
      .pipe(JSONStream.parse(/origin_bucket|cloudfront_distribution/g))
      .pipe(
        es.mapSync(async ({ origin_bucket, cloudfront_distribution }) => {
          const originBucketName = origin_bucket.value.bucket;
          const cloudfrontDistribution = cloudfront_distribution.value.id;

          const s3SyncCommand = `aws s3 ${awsProfileFlag} sync ${flags.localDir} s3://${originBucketName}`;
          const clearCacheCommand = `aws cloudfront ${awsProfileFlag} create-invalidation --distribution-id ${cloudfrontDistribution} --paths \"/*\"`;

          console.log(
            `Uploading ${flags.localDir} to S3 bucket:\n${s3SyncCommand}\n`
          );
          await exec(s3SyncCommand);
          console.log(
            `Flushing Cloudfront distribution ${cloudfrontDistribution}:\n${clearCacheCommand}\n`
          );
          await exec(clearCacheCommand);
        })
      );
  }
}

PublishStaticWebsiteCommand.description =
  "Upload static website files to an existing S3 bucket, and flush the Cloudfront cache. Requires terraform output to be piped in.";

PublishStaticWebsiteCommand.flags = {
  localDir: flags.string({
    char: "d",
    description: "The local dir to upload to the S3 bucket.",
  }),
};

module.exports = PublishStaticWebsiteCommand;
