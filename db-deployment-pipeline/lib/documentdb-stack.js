const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const docdbElastic = require("aws-cdk-lib/aws-docdbelastic");

class DocumentDbStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    console.log("Deploying to:", props.env);

    const sg = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      "sg-0a518627099d85813-Database",
      "sg-0a518627099d85813",
      { mutable: false }
    );

    const serverlessCluster = new docdbElastic.CfnCluster(
      this,
      "pvl-users-qual-qa-v5",
      {
        clusterName: "pvl-users-qual-qa-v5",
        adminUserName: "docdbMaster",
        adminUserPassword: "SuperSecretPass123",
        authType: "PLAIN_TEXT",
        shardCount: 1,
        shardCapacity: 2,
        subnetIds: ["subnet-0018071d85dcd8587", "subnet-0edce4a02d4e06e30"],
        vpcSecurityGroupIds: [sg.securityGroupId],
        deletionProtection: false
      }
    );

    new cdk.CfnOutput(this, "ServerlessEndpoint", {
      value: serverlessCluster.attrClusterEndpoint,
      description: "DocumentDB Serverless Endpoint"
    });
  }
}

module.exports = { DocumentDbStack };