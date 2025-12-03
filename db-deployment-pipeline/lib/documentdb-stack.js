const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const docdbElastic = require("aws-cdk-lib/aws-docdbelastic");

class DocumentDbStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { configuration, DEPLOY_ENV } = props;

    const sg = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      configuration.securityGroupName,
      configuration.securityGroupID,
      { mutable: false }
    );

    const serverlessCluster = new docdbElastic.CfnCluster(
      this,
      configuration.dbClusterName,
      {
        clusterName: configuration.dbClusterName,
        adminUserName: configuration.adminUserName,
        adminUserPassword: configuration.adminUserPassword,
        authType: "PLAIN_TEXT",
        shardCount: 1,
        shardCapacity: 2,
        subnetIds: configuration.subnetIds,
        vpcSecurityGroupIds: [sg.securityGroupId],
        deletionProtection: configuration.deletionProtection,
        backupRetentionPeriod: 7,
        preferredBackupWindow: "00:00-00:30",
        preferredMaintenanceWindow: "sat:08:51-sat:09:21",
        // tags: [
        //   { key: "Environment", value: DEPLOY_ENV },
        //   { key: "Application", value: "pvl-users-database" },
        //   { key: "Owner", value: "arijitbose/saravanakumar"},
        //   { key: "Cost Center", value: "arijitbose/saravanakumar"},
        //   { key: "Project", value: "pvlusers"},
        //   { key: "Created By", value: "cdk"},
        // ]
      }
    );

    new cdk.CfnOutput(this, "ServerlessEndpoint", {
      value: serverlessCluster.attrClusterEndpoint,
      description: "DocumentDB Serverless Endpoint"
    });
  }
}

module.exports = { DocumentDbStack };