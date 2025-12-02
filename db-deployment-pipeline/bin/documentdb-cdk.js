#!/usr/bin/env node

const cdk = require("aws-cdk-lib");
const { DocumentDbStack } = require("../lib/documentdb-stack");

const app = new cdk.App();

const DEPLOY_ENV = process.env.DEPLOY_ENV;

if (DEPLOY_ENV !== "production" && DEPLOY_ENV !== "staging" && DEPLOY_ENV !== "qual-qa") {
  throw new Error(
    "Please set the DEPLOY_ENV variable to 'qual-qa', 'staging', or 'production'"
  );
}

console.log("Deploying to DEPLOY_ENV:", DEPLOY_ENV);

const env = {
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

console.log("Using account details:", env[DEPLOY_ENV]);

const configurations = {
  production: {
    securityGroupName: "default",
    securityGroupID: "sg-62c68e13",
    dbClusterName: "pvl-users-production",
    adminUserName: "incrowdadmin",
    adminUserPassword: "6DYfDcG1n9DWk1TvLLxyIgdTsAy4BFnPxTR",
    subnetIds: ["subnet-b12dbd9d", "subnet-8ec48fc6"],
    deletionProtection: false,
  },
  staging: {
    securityGroupName: "staging-rds-sg",
    securityGroupID: "sg-0e3e9ff15fef824e3",
    dbClusterName: "pvl-users-staging",
    adminUserName: "pvlqaadmin",
    adminUserPassword: "kA17GrwdgLXUeqt",
    subnetIds: ["subnet-fa6965b1", "subnet-f5a9edda"],
    deletionProtection: false,
  },
  "qual-qa": {
    securityGroupName: "sg-0a518627099d85813-Database",
    securityGroupID: "sg-0a518627099d85813",
    dbClusterName: "pvl-users-qual-qa-v2",
    adminUserName: "pvlqualqaadmin",
    adminUserPassword: "26rJa88iHxvpyUR",
    subnetIds: ["subnet-0018071d85dcd8587", "subnet-0edce4a02d4e06e30"],
    deletionProtection: false,
  },
};

console.log("Using configuration:", configurations[DEPLOY_ENV]);

new DocumentDbStack(app, "DocumentDbStack", {
  env: env[DEPLOY_ENV],
  configuration: configurations[DEPLOY_ENV],
  DEPLOY_ENV: DEPLOY_ENV,
});
