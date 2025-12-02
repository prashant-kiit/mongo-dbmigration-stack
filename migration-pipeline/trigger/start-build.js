const { CodeBuildClient, StartBuildCommand } = require("@aws-sdk/client-codebuild");

const client = new CodeBuildClient({ region: "us-east-1" });

const command = new StartBuildCommand({
  projectName: "PVLDocumentdbMigrationQualQ-T4i5IAedXYlR",
});

client.send(command).then((response) => {
  console.log("Triggered Build:", response.build.id);
});
