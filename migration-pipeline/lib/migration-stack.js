const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
const ec2 = require("aws-cdk-lib/aws-ec2");

class MigrationStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { env, configuration } = props;

    const vpc = ec2.Vpc.fromLookup(this, "ExistingVpc", {
      vpcId: configuration.vpcId,
    });

    const sg = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      configuration.securityGroupName,
      configuration.securityGroupID,
      { mutable: false }
    );

    const subnet1 = ec2.Subnet.fromSubnetId(this, "Subnet1", configuration.subnetIds[0]); 
    const subnet2 = ec2.Subnet.fromSubnetId(this, "Subnet2", configuration.subnetIds[1]);

    const subnetSelection = {
      subnets: [subnet1, subnet2]
    };

    const project = new codebuild.Project(this, configuration.newDbClusterName, {
      vpc: vpc,
      subnetSelection: subnetSelection,
      securityGroups: [sg],
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
          pre_build: {
            commands: ["mongodump --version", "mongorestore --version"],
          },
          build: {
            commands: [
              `mongodump --host ${configuration.oldDbClusterName}.us-east-1.docdb.amazonaws.com:27017 --username ${configuration.oldAdminUsername} --password ${configuration.oldAdminPassword} --out /tmp/docdb-backup`,
              "cd /tmp/docdb-backup",
              "ls -al",
              "cd ~",
              `mongorestore --host ${configuration.newDbClusterName}-${env.account}.us-east-1.docdb-elastic.amazonaws.com --port 27017 --username ${configuration.newAdminUsername} --password ${configuration.newAdminPassword} --ssl --authenticationMechanism SCRAM-SHA-1 /tmp/docdb-backup`,
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
