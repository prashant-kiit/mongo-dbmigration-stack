const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const docdbElastic = require("aws-cdk-lib/aws-docdbelastic");

class DocumentDbStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    const { configuration } = props;

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
      }
    );

    new cdk.CfnOutput(this, "ServerlessEndpoint", {
      value: serverlessCluster.attrClusterEndpoint,
      description: "DocumentDB Serverless Endpoint"
    });
  }
}

module.exports = { DocumentDbStack };