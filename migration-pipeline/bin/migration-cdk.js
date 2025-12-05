const cdk = require("aws-cdk-lib");
const { MigrationStack } = require("../lib/migration-stack");

const app = new cdk.App();

const DEPLOY_ENV = process.env.DEPLOY_ENV;

if (
  DEPLOY_ENV !== "production" &&
  DEPLOY_ENV !== "staging" &&
  DEPLOY_ENV !== "qual-qa"
) {
  throw new Error(
    "Please set the DEPLOY_ENV variable to 'production', 'staging', or 'qual-qa'"
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
    vpcId: "vpc-d4dd46ad",
    securityGroupName: "default",
    securityGroupID: "sg-62c68e13",
    oldDbClusterName: "pvl-users.cluster-c2btvs01aa6s",
    oldAdminUsername: "incrowdadmin",
    oldAdminPassword: "*************************",
    newDbClusterName: "pvl-users-production",
    newAdminUsername: "incrowdadmin",
    newAdminPassword: "*************************",
    subnetIds: ["subnet-b12dbd9d", "subnet-8ec48fc6"],
  },
  staging: {
    vpcId: "vpc-538a7f28",
    securityGroupName: "staging-rds-sg",
    securityGroupID: "sg-0e3e9ff15fef824e3",
    oldDbClusterName: "pvl-users-qa.cluster-c2btvs01aa6s",
    oldAdminUsername: "pvlqaadmin",
    oldAdminPassword: "***************",
    newDbClusterName: "pvl-users-staging",
    newAdminUsername: "pvlqaadmin",
    newAdminPassword: "***************",
    subnetIds: ["subnet-fa6965b1", "subnet-f5a9edda"],
  },
  "qual-qa": {
    vpcId: "vpc-7ae31207",
    securityGroupName: "sg-0a518627099d85813-Database",
    securityGroupID: "sg-0a518627099d85813",
    oldDbClusterName: "pvl-users-qual-qa.cluster-cpocv8v6scdp",
    oldAdminUsername: "pvlqualqaadmin",
    oldAdminPassword: "***************",
    newDbClusterName: "pvl-users-qual-qa-v2",
    newAdminUsername: "pvlqualqaadmin",
    newAdminPassword: "***************",
    subnetIds: ["subnet-0018071d85dcd8587", "subnet-0edce4a02d4e06e30"],
  },
};

console.log("Using configuration:", configurations[DEPLOY_ENV]);

new MigrationStack(app, "MigrationStack", {
  env: env[DEPLOY_ENV],
  configuration: configurations[DEPLOY_ENV],
});
