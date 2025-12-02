#!/usr/bin/env node

const cdk = require("aws-cdk-lib");
const { DocumentDbStack } = require("../lib/documentdb-stack");

const app = new cdk.App();

const environment = app.node.tryGetContext("env") || "development";

const accounts = {
  production: {
    account: "591636224332",
    region: "us-east-1",
  },
  development: {
    account: "631543112504",
    region: "us-east-1",
  },
};

const configurations = {
  production: {
    securityGroupName: "default",
    securityGroupID: "sg-62c68e13",
    dbClusterName: "pvl-users-production",
    adminUserName: "pvluseradminprod",
    adminUserPassword: "junK8m3b4wQX5Ls",
    subnetIds: ["subnet-b12dbd9d", "subnet-8ec48fc6"],
    deletionProtection: false,
  },
  staging: {
    securityGroupName: "staging-rds-sg",
    securityGroupID: "sg-0e3e9ff15fef824e3",
    dbClusterName: "pvl-users-staging",
    adminUserName: "pvluseradminstaging",
    adminUserPassword: "ji7JkD3v4bWQ8Ns", 
    subnetIds: ["subnet-fa6965b1", "subnet-f5a9edda"],
    deletionProtection: false,
  },
  "qual-qa": {
    securityGroupName: "sg-0a518627099d85813-Database",
    securityGroupID: "sg-0a518627099d85813",
    dbClusterName: "pvl-users-qual-qa",
    adminUserName: "pvluseradminkonovoqualqa",
    adminUserPassword: "f9QmT27aVxpRkJH",
    subnetIds: ["subnet-0018071d85dcd8587", "subnet-0edce4a02d4e06e30"],
    deletionProtection: false,
  },
};

new DocumentDbStack(app, "DocumentDbStack", {
  account: accounts[environment],
  configuration: configurations[environment],
});
