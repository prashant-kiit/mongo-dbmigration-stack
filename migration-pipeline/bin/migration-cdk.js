const cdk = require("aws-cdk-lib");
const { MigrationStack } = require("../lib/migration-stack");

const app = new cdk.App();

const environment = app.node.tryGetContext("env") || "development";

const accounts = {
  production: {
    accountId: "591636224332",
    region: "us-east-1",
  },
  development: {
    accountId: "631543112504",
    region: "us-east-1",
  },
};

const configurations = {
  production: {
    vpcId: "vpc-d4dd46ad",
    securityGroupName: "default",
    securityGroupID: "sg-62c68e13",
    oldDbClusterName: "pvl-users.cluster-c2btvs01aa6s",
    oldAdminUsername: "incrowdadmin",
    oldAdminPassword: "",
    newDbClusterName: "pvl-users-production",
    newAdminUsername: "pvluseradminkonovoprod",
    newAdminPassword: "junK8m3b4wQX5Ls",
    subnetIds: ["subnet-b12dbd9d", "subnet-8ec48fc6"],
  },
  staging: {
    vpcId: "vpc-538a7f28",
    securityGroupName: "staging-rds-sg",
    securityGroupID: "sg-0e3e9ff15fef824e3",
    oldDbClusterName: "pvl-users-qa.cluster-c2btvs01aa6s",
    oldAdminUsername: "pvlqaadmin",
    oldAdminPassword: "",
    newDbClusterName: "pvl-users-staging",
    newAdminUsername: "pvluseradminkonovostaging",
    newAdminPassword: "ji7JkD3v4bWQ8Ns",
    subnetIds: ["subnet-fa6965b1", "subnet-f5a9edda"],
  },
  "qual-qa": {
    vpcId: "vpc-7ae31207",
    securityGroupName: "sg-0a518627099d85813-Database",
    securityGroupID: "sg-0a518627099d85813",
    oldDbClusterName: "pvl-users-qual-qa.cluster-cpocv8v6scdp",
    oldAdminUsername: "pvlqualqaadmin",
    oldAdminPassword: "26rJa88iHxvpyUR",
    newDbClusterName: "pvl-users-qual-qa-v2",
    newAdminUsername: "pvluseradminkonovoqualqa",
    newAdminPassword: "f9QmT27aVxpRkJH",
    subnetIds: ["subnet-0018071d85dcd8587", "subnet-0edce4a02d4e06e30"],
  },
};

new MigrationStack(app, "MigrationStack", {
  account: accounts[environment],
  configuration: configurations[environment],
});
