const {
  CloudFormationClient,
  DescribeStacksCommand,
} = require("@aws-sdk/client-cloudformation");
const {
  CodeBuildClient,
  StartBuildCommand,
} = require("@aws-sdk/client-codebuild");

async function main() {
  const client = new CloudFormationClient({ region: "us-east-1" });

  const res = await client.send(
    new DescribeStacksCommand({
      StackName: "MigrationStack",
    })
  );

  const outputs = res.Stacks[0].Outputs;

  const projectName = outputs.find(
    (o) => o.OutputKey === "CodeBuildProjectName"
  ).OutputValue;

  console.log("CodeBuild Project Name =", projectName);

  const codebuildClient = new CodeBuildClient({ region: "us-east-1" });

  const command = new StartBuildCommand({
    projectName: projectName,
  });

  const response = await codebuildClient.send(command);

  console.log("Triggered Build:", response.build.id);
}

main().catch((error) => {
  console.error("Error triggering build:", error);
  process.exit(1);
});
