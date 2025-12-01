const cdk = require("aws-cdk-lib");
const ec2 = require("aws-cdk-lib/aws-ec2");
const docdb = require("aws-cdk-lib/aws-docdb");
const { Construct } = require("constructs");

class DocumentDbStack extends cdk.Stack {
  constructor(scope, id, props) {
    super(scope, id, props);

    console.log("Deploying to:", props.env);

    // ✅ Use existing VPC
    const vpc = ec2.Vpc.fromLookup(this, "ExistingVpc", {
      vpcId: "vpc-7ae31207"
    });

    // ✅ Use existing Security Group
    const sg = ec2.SecurityGroup.fromSecurityGroupId(
      this,
      "ExistingDocDbSG",
      "sg-0a518627099d85813",
      { mutable: false }
    );

    // ❌ Do NOT add ingress rules (not allowed on existing SG)
    // sg.addIngressRule(...)  <-- removed

    // ✅ Subnets only in AZ us-east-1b
    const subnetsIn1b = vpc.selectSubnets({
      availabilityZones: ["us-east-1b"],
      subnetType: ec2.SubnetType.PRIVATE_WITH_EGRESS
    });

    // Subnet Group
    const subnetGroup = new docdb.CfnDBSubnetGroup(this, "DocDbSubnetGroup", {
      dbSubnetGroupDescription: "Subnet group for DocumentDB in us-east-1b",
      subnetIds: subnetsIn1b.subnetIds,
    });

    // DocumentDB Cluster
    const cluster = new docdb.CfnDBCluster(this, "DocDbCluster", {
      masterUsername: "docdbMaster",
      masterUserPassword: "SuperSecretPass123!",
      engineVersion: "5.0",
      dbSubnetGroupName: subnetGroup.dbSubnetGroupName,
      vpcSecurityGroupIds: [sg.securityGroupId],
      storageEncrypted: true,
      backupRetentionPeriod: 7,
      availabilityZones: ["us-east-1b"]
    });

    // Cluster Instance
    new docdb.CfnDBInstance(this, "DocDbInstance1", {
      dbClusterIdentifier: cluster.ref,
      dbInstanceClass: "db.r5.large",
      availabilityZone: "us-east-1b"  // <-- Force instance to this AZ
    });
  }
}

module.exports = { DocumentDbStack };
