+++
date = '2024-09-25T14:01:05+07:00'
draft = false
title = 'Set Up ECS Using EC2 Capacity Providers'
slug = 'set-up-ECS-using-EC2-capacity-providers'
author = 'Phillip Nguyen'
summary = "Let's host our application on ECS using EC2 capacity providers"
+++
In this article, let create an ECS cluster using EC2 capacity providers to host a simple Golang application.

You can find the full code for this article in this [GitHub repository](https://github.com/saldyy/aws-code-pipeline-101)

ECS is a container orchestration service that allows you to run and manage Docker containers on a cluster of computing resources. ECS supports two types of capacity providers: Fargate and EC2. Fargate is a serverless compute engine for containers that allows you to run containers without having to manage the underlying infrastructure. EC2 capacity providers allow you to run containers on a cluster of EC2 instances that you manage.

This article will focus on setting up an ECS cluster using EC2 capacity providers. Fargate is far more easier to set up and manage, but it is also more expensive than EC2 capacity providers. For cost savings, it is recommended to use EC2 capacity providers but the trade off is that you will have to configure and manage the underlying EC2 instances yourself.

I will use **AWS CDK with Python** to create the ECS cluster and deploy a simple Golang application to the cluster.

### Step 1: Set up the Elastic Container Registry (ECR) to host our Docker image
First, we need to create an Elastic Container Registry (ECR) to host our Docker image. ECR is a fully managed Docker container registry that makes it easy to store, manage, and deploy Docker images. We will use ECR to store the Docker image for our Golang application.

```python
class EcrStack(Stack):

    def __init__(self, scope: Construct, id, **kwargs):
        super().__init__(scope, id, **kwargs)
        self.repository = ecr.Repository(self, id, repository_name="golang-ci-cd")
```


### Step 2: Set up VPC 
The VPC we're going to create will have 3 public subnets and 3 private subnets. The public subnets will be used for the ECS cluster and the private subnets will be used for the EC2 instances.

```python
class VpcStack(Stack):

    def __init__(self, scope: Construct, id, **kwargs):
        super().__init__(scope, id, **kwargs)
        self.vpc = aws_ec2.Vpc(
            self,
            id="GolangVpc",
            cidr="10.0.0.1/16",
            availability_zones=[
                "ap-southeast-1a",
                "ap-southeast-1b",
                "ap-southeast-1c"
            ]
        )

        CfnOutput(self, "VpcId", value=self.vpc.vpc_id)
```

### Step 3: Set up the ECS cluster

Now the fun parts. We will create an ECS cluster using EC2 capacity providers. The ECS cluster will be created in the public subnets of the VPC we created in the previous step. First, we will create the ECS cluster with the capacity providers set to EC2. We will also add an AutoScalingGroup to the cluster to manage the EC2 instances. We will need to attach the VPC we created in the previous step to the ECS cluster on line 2.

```python
    # ECS Cluster
    self.cluster = ecs.Cluster(self, "MyCluster", vpc=vpc, cluster_name="GolangCluster")
    # Add capacity to it
    self.cluster.add_capacity("DefaultAutoScalingGroupCapacity",
        instance_type=ec2.InstanceType("t2.small"),
        machine_image=ecs.EcsOptimizedImage.amazon_linux2(),
        spot_instance_draining=True,
        auto_scaling_group_name="GolangAppASG",
        desired_capacity=1,
        min_capacity=1,
        max_capacity=3,
    )

```

Then we will set up the ECS service and task definition for our Golang application. The task definition will use the Docker image stored in the ECR repository we created in the first step.

```python
    # ECS Task Definition
    self.task_definition = ecs.Ec2TaskDefinition(
        self,
        "GolangTaskDefinition",
        network_mode=ecs.NetworkMode.AWS_VPC,
    )

    self.task_definition.add_container("DefaultContainer",
        image=ecs.ContainerImage.from_ecr_repository(repository, tag="0"),
        memory_limit_mib=512,
        cpu=256,
        container_name="GolangContainer",
        port_mappings=[ecs.PortMapping(
            container_port=8080,
            protocol=ecs.Protocol.TCP)
        ],
        logging=ecs.LogDriver.aws_logs(stream_prefix="ecs", log_group=log_group)
    )

    # ECS Service
    self.service = ecs_patterns.ApplicationLoadBalancedEc2Service(
        self, "GolangApplicationService",
        cluster=self.cluster,
        task_definition=self.task_definition,
        desired_count=1,
        public_load_balancer=True,
        listener_port=80,
        target_protocol=elbv2.ApplicationProtocol.HTTP,
        deployment_controller=ecs.DeploymentController(type=ecs.DeploymentControllerType.CODE_DEPLOY),
        cpu=512,
        memory_limit_mib=1024,
    )

    # Customize the health check on the target group
    self.service.target_group.configure_health_check(
        path="/",
        port="8080",
        healthy_http_codes="200",
        interval=Duration.seconds(30),
        timeout=Duration.seconds(5),
        healthy_threshold_count=2,
        unhealthy_threshold_count=3,
    )
```

In the code above, we created an ECS task definition with a single container that uses the Docker image stored in the ECR repository. We then created an ECS service that runs the task definition on the ECS cluster. The service is exposed through an Application Load Balancer that listens on port 80 and forwards traffic to port 8080 on the container.

For the EC2 capacity provider, we can set 3 main types of network mode: **AWS_VPC**, **BRIDGE**, and **HOST**.
In this article, we will use **AWS_VPC** as it is the most common network mode for ECS services.
 - For **BRIDGE** mode, the container will be assigned a random and unused port from the ephemeral port
   range by Docker. This way is very hard to track down which port is being used by the container.
 - For **HOST** mode, the container will be directly connected to the host network. The drawbacks of
   this mode are that the host can only have one single task running on it and there is no way to
   remap the container port. This mode is not recommended by **AWS**.

When firstly creating the task definition, we need to specify the Docker image to use. In this use case, we will need to create an initial Docker image for the ECR repository created in Step 1 and assign it to the task definition. In this code, I let the image tag be 0, but you can change it to whatever you want.

There are some common configuration for task definition that I set which is:
- cpu: The number of cpu units to reserve for the container. The value of cpu must be within the range
  of 0.25 to 4096.
- memory_limit_mib: The amount of memory (in MiB) to reserve for the container. 
- container_name: The name of the container. This name will be used in the ECS service to refer to the
  container.
You can find out more [ here ](https://docs.aws.amazon.com/cdk/api/v2/python/aws_cdk.aws_ecs/TaskDefinition.html).

The ECS service is created using the **ecs_patterns.ApplicationLoadBalancedEc2Service** construct. This is a pre-built construct that creates an ECS service with an Application Load Balancer. It will setup the necessary resources for the ECS service, including the target group, listener, and load balancer. The service is exposed on port 80 and forwards traffic to port 8080 on the container.

We set the deploymen controller to **type=ecs.DeploymentControllerType.CODE_DEPLOY**. This will enable the CodeDeploy deployment controller for the ECS service. This will allow us to perform Blue Green deployment. Stay tune for the next article where I will show you how to set up Blue Green deployment for this Application.

Finally, we customize the health check on the target group to check the health of the container. The health check will send a GET request to the root path of the container and expect a 200 response code. The health check will run every 30 seconds and timeout after 5 seconds. The target group will be considered healthy if it receives 2 successful health checks in a row and unhealthy if it receives 3 failed health checks in a row. You can customize the health check to suit your use case.





