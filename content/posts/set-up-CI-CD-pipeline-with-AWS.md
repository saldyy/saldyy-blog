+++
date = '2024-10-06T15:19:49+07:00'
draft = true
title = 'Set up CI/CD pipeline with AWS'
+++

In this [article](https://saldyy.com/articles/set-up-ECS-using-EC2-capacity-providers), we have successfully setup an ECS cluster and deploy a simple Golang application to it. Now, we will create a CI/CD pipeline for our application in AWS.

You can find the full code for this article in this [GitHub repository](https://github.com/saldyy/aws-code-pipeline-101)

Normally, we will need to create a CodeCommit repository to store our source code in AWS. However, for AWS CodePipeline, we can use other source code repositories like GitHub, Bitbucket, etc... In this article, we will use GitHub as our source code repository.
You can set up up in the AWS Management Console by this following [guide](https://docs.aws.amazon.com/codepipeline/latest/userguide/connections-github.html). It's called Connection in AWS, which previously called AWS Codestar Connection (this was [deprecated](https://aws.amazon.com/about-aws/whats-new/2024/03/aws-codeconnections-formerly-codestar-connections/)).

After setting up the connection, we will create a new CodePipeline in the AWS Management Console. The pipeline will have 4 stages: Source, Test, Build and Deploy. The Source stage will get the source code from the GitHub repository, the Test stage will run Unit test for the application, the Build stage will build the Docker image, and the Deploy stage will deploy the Docker image to the ECS cluster using Blue Green Deployment strategy.

### Set up Source stage

First, we will define a pipeline in our CDK stack. We will create a **CodePipeline** with a single stage called "Source". The Source stage will get the source code from the GitHub repository using the **CodeStarConnectionsSourceAction** (for some reasons, this is still not renamed).

In the below code, you might notice that we define **source_output** as an **Artifact**.

An ****Artifact**** is the data that is produced as a result of a **CodePipeline** action. It is used to pass data between stages in a pipeline. In this case, we will create an **Artifact** to store the source code that is retrieved from the GitHub repository. By default, the **Artifact** is stored in the **S3** bucket that is created by the CDK stack.

```python
    pipeline = codepipeline.Pipeline(self, "Pipeline")

    source_output = codepipeline.Artifact(artifact_name="SourceArtifact")
    source_action = codepipeline_actions.CodeStarConnectionsSourceAction(
        action_name="Source",
        connection_arn=connection_arn,
        owner="saldyy",
        repo="aws-code-pipeline-101",
        output=source_output
    )
    pipeline.add_stage(stage_name="Source", actions=[source_action])
```

### Set up Test stage

Next up, we will set up the Test stage. This stage will run the unit tests for the application. We will use **CodeBuild** to run the unit tests. We will create a **CodeBuild** project that will run the unit tests for the application.

In the below code, we define a **CodeBuild** project called **GolangTestProject** that will run the unit tests for the application. We specify the build spec for the project that will run the unit tests. The build spec is a YAML file that contains the build commands for the project. In this case, we specify the build commands to run the unit tests for the application inside the CDK code. In reality, you might want to store the build spec in a separate file in the source code and call it as **buildspec.yaml** and reference it in the CDK code.

In the **buildspec**, we specify the runtime version of Golang to use for the project in **install** phase. And then, in the **build** phase, we will write the commands to run the unit tests for the application.

Notice that in the **CodeBuildAction**, we specify the **input** parameter to be the **source_output** Artifact that we defined in the Source stage. This means that the **CodeBuild** project will use the source code that is retrieved from the GitHub repository in the Source stage to run the unit tests.

```python
    test_project = codebuild.PipelineProject(
        self, "GolangTestProject",
        build_spec=codebuild.BuildSpec.from_object({
            "version": "0.2",
            "phases": {
                "install": {
                    "runtime-versions": {
                        "golang": "1.21.4"
                    }
                },
                "build": {
                    "commands": [
                        "go version",
                        "cd app",
                        "make test"
                    ]
                }
            }
        }),
        environment=codebuild.BuildEnvironment(
            build_image=codebuild.LinuxBuildImage.STANDARD_5_0
        )
    )
    test_action = codepipeline_actions.CodeBuildAction(
        action_name="RunTests",
        project=test_project,
        input=source_output
    )
    pipeline.add_stage(stage_name="Test", actions=[test_action])
```

### Set up Build stage

Now is the most fun part, the Build stage. The Build stage will build the Docker image for the application. We will continue to use **CodeBuild** to build the Docker image for our application.

```python
    build_project = codebuild.PipelineProject(
        self, "GolangBuildProject",
        role=code_build_access_role,
        build_spec=codebuild.BuildSpec.from_object({
            "version": 0.2,
            "phases": {
                "build": {
                    "commands": [
                        "cd app",
                        "IMAGE_TAG=golang-proj-$CODEBUILD_BUILD_NUMBER",
                        "aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin {ecr_uri}".format(ecr_uri=repository.repository_uri),
                        "docker build -t $IMAGE_TAG .",
                        "docker tag $IMAGE_TAG {ecr_uri}:$IMAGE_TAG".format(ecr_uri=repository.repository_uri),
                        "docker push {ecr_uri}:$IMAGE_TAG".format(ecr_uri=repository.repository_uri)
                    ]
                },
                "post_build": {
                    "commands": [
                        "IMAGE_TAG=golang-proj-$CODEBUILD_BUILD_NUMBER",
                        "IMAGE_URI={ecr_uri}:$IMAGE_TAG".format(ecr_uri=repository.repository_uri),
                        "aws ecs describe-task-definition --task-definition ${TASK_DEFINITION_NAME} | jq '.taskDefinition.containerDefinitions[0].image = \"\'\"$IMAGE_URI\"\'\"' > temp.json", "jq '.taskDefinition' temp.json > taskdef.json",
                    ]

                }
            },
            "artifacts": {
                "files": ["app/appspec.yaml", "app/taskdef.json"]
            }
        }),
        environment=codebuild.BuildEnvironment(
            build_image=codebuild.LinuxBuildImage.STANDARD_5_0,
            environment_variables = {
                "TASK_DEFINITION_NAME": codebuild.BuildEnvironmentVariable(value="...")
            }
        ),
    )

    build_output = codepipeline.Artifact(artifact_name="BuildArtifact")
    build_action = codepipeline_actions.CodeBuildAction(
        action_name="RunBuild",
        project=build_project,
        input=source_output,
        outputs=[build_output]
    )
    pipeline.add_stage(stage_name="Build", actions=[build_action], )
```
In the above code, you can see that there's a lots going on in the **buildspec**. Let's dive in to it. First, we will define the Docker image tag for the application. In this scenario, we will use the **CODEBUILD_BUILD_NUMBER** as the tag for the Docker image. This is a unique number that is generated by **CodeBuild** for each build. We will use this number as the tag for the Docker image so that we can track which build the Docker image was created from. For some other cases, you might want to use the **GIT_COMMIT** as the tag for the Docker image.

When we have the **IMAGE_TAG**, we will build and push the image to ECR, the commands here is quite simple, you can get it from AWS ECR console.

After the image is successfully built, we will enter the **post_build** phase where we will set up all the material for our CodeDeploy to run. When we deploy a new version of our application, most likely that only the business code are changed and not the infrastructure code. Therefore, we only need to change the image URL in the task definition and then update the service in ECS. In order to achieve that, first, I will use the AWS CLI command **describe-task-definition** to get the latest task definition of the service. Then, I leverage the [jq](https://jqlang.github.io/jq/) command to update the image URL in the task definition. When everything is set, I will pipe the new task definition into a file call **taskdef.json**.

The output artifact of this stage will be 2 files: **app/appspec.yaml** and **app/taskdef.json**. The **appspec.yaml** is the file that CodeDeploy will use to deploy the new version of the application to the ECS cluster. The **taskdef.json** is the new task definition that we will use to update the service in ECS.

The **appspec.yaml** file will look like this:

```yaml
Version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: <TASK_DEFINITION>
        LoadBalancerInfo:
          ContainerName: "GolangContainer"
          ContainerPort: 8080
```

### Set up Deploy stage

Finally, we will set up the Deploy stage. The Deploy stage will deploy the Docker image to the ECS cluster using the Blue Green Deployment strategy. The service we will use is **CodeDeploy**.

We will need to create an additional **Target Group** for the Green deployment. It's pretty straight forward, we need to linked all the correct configs and resources together. For the **deployment_config**, I'm setting it to ALL_AT_ONCE, but you can change it to somethine like LINEAR_10_PERCENT_EVERY_1_MINUTE or CANARY_10_PERCENT_5_MINUTES to suite your needs.

The action will also take the 2 files from the Build stage as input, and use them to deploy the new
version of the application to the ECS cluster.


```python
    deploy_application = codedeploy.EcsApplication(
        self,
        "CodeDeployApplication",
        application_name="GolangDeployApplication",
    )
    green_target_group = elbv2.ApplicationTargetGroup(self, "GreenTargetGroup",
                                                      vpc=ecs_service.cluster.vpc, port=80,
                                                      target_type=elbv2.TargetType.IP)
    deployment_group = codedeploy.EcsDeploymentGroup(
        self,
        "BlueGreenDeployDeploymentGroup",
        role=code_deploy_role,
        auto_rollback=codedeploy.AutoRollbackConfig(stopped_deployment=True),
        application=deploy_application,
        service=ecs_service.service,
        deployment_config=codedeploy.EcsDeploymentConfig.ALL_AT_ONCE,
        blue_green_deployment_config=codedeploy.EcsBlueGreenDeploymentConfig(
            blue_target_group=ecs_service.target_group,
            green_target_group=green_target_group,
            listener=ecs_service.listener,
        ),
    )

    deploy_action = codepipeline_actions.CodeDeployEcsDeployAction(
        action_name="Deploy",
        deployment_group=deployment_group,
        task_definition_template_file=codepipeline.ArtifactPath(build_output, file_name="app/taskdef.json"),
        app_spec_template_file=codepipeline.ArtifactPath(build_output, file_name="app/appspec.yaml"),
    )
    pipeline.add_stage(stage_name="Deploy", actions=[deploy_action])
```
