const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const docdb = require("aws-cdk-lib/aws-docdb");
const { Construct } = require("constructs");

class DocumentDbStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    console.log("Deploying to:", props.env);

    const sg = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      "ExistingDocDbSG",
      "sg-0a518627099d85813",
      { mutable: false }
    );

    const cluster = new docdb.CfnDBCluster(this, "DocDbCluster", {
      masterUsername: "docdbMaster",
      masterUserPassword: "SuperSecretPass123!",
      engineVersion: "5.0",
      vpcSecurityGroupIds: [sg.securityGroupId],
      storageEncrypted: true,
      backupRetentionPeriod: 7,
      deletionProtection: false
    });

    new docdb.CfnDBInstance(this, "DocDbInstance1", {
      dbClusterIdentifier: cluster.ref,
      dbInstanceClass: "db.r5.large"
    });
  }
}

module.exports = { DocumentDbStack };
