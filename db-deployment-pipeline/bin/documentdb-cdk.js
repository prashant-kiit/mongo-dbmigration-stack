#!/usr/bin/env node

const cdk = require("aws-cdk-lib");
const { DocumentDbStack } = require("../lib/documentdb-stack");

const app = new cdk.App();

const environment = process.env.DEPLOY_ENV;

if (environment !== "production" && environment !== "staging" && environment !== "qual-qa") {
  throw new Error(
    "Please set the ENV environment variable to 'qual-qa', 'staging', or 'production'"
  );
}

console.log("Deploying to environment:", environment);

const accounts = {
  production: {
    account: "591636224332",
    region: "us-east-1",
  },
  staging: {
    account: "591636224332",
    region: "us-east-1",
  },
  "qual-qa": {
    account: "631543112504",
    region: "us-east-1",
  },
};

console.log("Using account details:", accounts[environment]);

const configurations = {
  production: {
    securityGroupName: "default",
    securityGroupID: "sg-62c68e13",
    dbClusterName: "pvl-users-production",
    adminUserName: "pvluseradminkonovoprod",
    adminUserPassword: "junK8m3b4wQX5Ls",
    subnetIds: ["subnet-b12dbd9d", "subnet-8ec48fc6"],
    deletionProtection: false,
  },
  staging: {
    securityGroupName: "staging-rds-sg",
    securityGroupID: "sg-0e3e9ff15fef824e3",
    dbClusterName: "pvl-users-staging",
    adminUserName: "pvluseradminkonovostaging",
    adminUserPassword: "ji7JkD3v4bWQ8Ns",
    subnetIds: ["subnet-fa6965b1", "subnet-f5a9edda"],
    deletionProtection: false,
  },
  "qual-qa": {
    securityGroupName: "sg-0a518627099d85813-Database",
    securityGroupID: "sg-0a518627099d85813",
    dbClusterName: "pvl-users-qual-qa-v2",
    adminUserName: "pvluseradminkonovoqualqa",
    adminUserPassword: "f9QmT27aVxpRkJH",
    subnetIds: ["subnet-0018071d85dcd8587", "subnet-0edce4a02d4e06e30"],
    deletionProtection: false,
  },
};

console.log("Using configuration:", configurations[environment]);

// new DocumentDbStack(app, "DocumentDbStack", {
//   account: accounts[environment],
//   configuration: configurations[environment],
// });
