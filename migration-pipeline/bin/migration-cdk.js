const cdk = require("aws-cdk-lib");
const { MigrationStack } = require("../lib/migration-stack");

const app = new cdk.App();

const envName = app.node.tryGetContext("env") || "development";

const accounts = {
  production: {
    account: "591636224332",
    region: "us-east-1"
  },
  development: {
    account: "631543112504",
    region: "us-east-1"
  }
};

new MigrationStack(app, "MigrationStack", {
  env: accounts[envName]
});
