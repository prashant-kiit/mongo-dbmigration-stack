const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
const iam = require("aws-cdk-lib/aws-iam");

class MigrationStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // const role = new iam.Role(this, "CodeBuildRole", {
    //   assumedBy: new iam.ServicePrincipal("codebuild.amazonaws.com"),
    //   managedPolicies: [
    //     iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonS3FullAccess"),
    //     iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchLogsFullAccess"),
    //   ],
    // });

    const project = new codebuild.Project(this, "documentdb-migration-qual-qa", {
      projectName: "documentdb-migration-qual-qa",
      // role: role,
      // source: codebuild.Source.gitHub({
      //   owner: "your-github-user",
      //   repo: "your-repo",
      //   branchOrRef: "main",
      // }),
      // environment: {
      //   buildImage: codebuild.LinuxBuildImage.STANDARD_7_0,
      //   computeType: codebuild.ComputeType.SMALL,
      // },
      buildSpec: codebuild.BuildSpec.fromObject({
        version: "0.2",
        phases: {
          install: {
            commands: [
              "wget https://fastdl.mongodb.org/tools/db/mongodb-database-tools-ubuntu2004-x86_64-100.10.0.tgz",
              "tar -xzf mongodb-database-tools-ubuntu2004-*.tgz",
              "sudo mv mongodb-database-tools-ubuntu2004-*/bin/* /usr/local/bin/",
            ],
          },
          "pre-build": {
            commands: ["mongodump --version", "mongorestore --version"],
          },
          build: {
            commands: [
              "mongodump --host pvl-users-qual-qa.cluster-cpocv8v6scdp.us-east-1.docdb.amazonaws.com:27017 --username pvlqualqaadmin --password 26rJa88iHxvpyUR --out /tmp/docdb-backup",
              "cd /tmp/docdb-backup",
              "ls -al",
              "cd ~",
              "mongorestore --host pvl-users-qual-qa-v6-631543112504.us-east-1.docdb-elastic.amazonaws.com --port 27017 --username docdbMaster --password SuperSecretPass123 --ssl --authenticationMechanism SCRAM-SHA-1 /tmp/docdb-backup",
            ],
          },
        },
      }),
    });

    new cdk.CfnOutput(this, "CodeBuildProjectName", {
      value: project.projectName,
    });
  }
}

module.exports = { MigrationStack };
