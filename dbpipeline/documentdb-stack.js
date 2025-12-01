const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const docdb = require("aws-cdk-lib/aws-docdb");
const { Construct } = require("constructs");

class DocumentDbStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    // VPC (you can replace with fromLookup)
    const vpc = new ec2.Vpc(this, "DocDbVpc", {
      maxAzs: 2,
      natGateways: 1,
    });

    // Security Group
    const sg = new ec2.SecurityGroup(this, "DocDbSg", {
      vpc,
      description: "Allow DocumentDB access",
      allowAllOutbound: true,
    });

    // Allow local machine IP (change 1.2.3.4/32)
    sg.addIngressRule(ec2.Peer.ipv4("1.2.3.4/32"), ec2.Port.tcp(27017));

    // Subnet Group
    const subnetGroup = new docdb.CfnDBSubnetGroup(this, "DocDbSubnetGroup", {
      dbSubnetGroupDescription: "Subnet group for DocumentDB",
      subnetIds: vpc.privateSubnets.map((s) => s.subnetId),
      dbSubnetGroupName: "docdb-subnet-group",
    });

    // DocumentDB Cluster
    const cluster = new docdb.CfnDBCluster(this, "DocDbCluster", {
      masterUsername: "admin",
      masterUserPassword: "SuperSecretPass123!",
      engineVersion: "5.0",
      dbSubnetGroupName: subnetGroup.dbSubnetGroupName,
      vpcSecurityGroupIds: [sg.securityGroupId],
      storageEncrypted: true,
      backupRetentionPeriod: 7,
    });

    // Cluster Instance
    new docdb.CfnDBInstance(this, "DocDbInstance1", {
      dbClusterIdentifier: cluster.ref,
      dbInstanceClass: "db.r5.large",
    });
  }
}

module.exports = { DocumentDbStack };
