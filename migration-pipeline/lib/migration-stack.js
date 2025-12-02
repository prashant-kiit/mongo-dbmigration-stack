const cdk = require("aws-cdk-lib");
const codebuild = require("aws-cdk-lib/aws-codebuild");
const ec2 = require("aws-cdk-lib/aws-ec2");

class MigrationStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const vpc = ec2.Vpc.fromLookup(this, "ExistingVpc", {
      vpcId: "vpc-7ae31207"
    });

    const sg = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      "sg-0a518627099d85813-Database",
      "sg-0a518627099d85813",
      { mutable: false }
    );

    const subnet1 = ec2.Subnet.fromSubnetId(this, "Subnet1", "subnet-0018071d85dcd8587"); 
    const subnet2 = ec2.Subnet.fromSubnetId(this, "Subnet2", "subnet-0edce4a02d4e06e30");

    const subnetSelection = {
      subnets: [subnet1, subnet2]
    };

    const project = new codebuild.Project(this, "PVLDocumentdbMigrationQualQa", {
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
