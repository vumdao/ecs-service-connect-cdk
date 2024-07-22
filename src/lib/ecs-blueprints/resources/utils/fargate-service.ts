import { Duration, RemovalPolicy } from 'aws-cdk-lib';
import {
  AwsLogDriver,
  ContainerImage,
  FargateService,
  FargateTaskDefinition,
} from 'aws-cdk-lib/aws-ecs';
import { PolicyStatement, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { LogGroup, RetentionDays } from 'aws-cdk-lib/aws-logs';
import { Construct } from 'constructs';
import { ECS_CAPACITY_TYPE, EcsBluepritnsServiceProps } from './utils';

export class CreateEcsFargateService extends Construct {
  ecsService: FargateService;
  constructor(scope: Construct, id: string, props: EcsBluepritnsServiceProps) {
    super(scope, id);

    /**
     * Elastic Container Registry
     */
    const containerImage = ContainerImage.fromRegistry(props.onlineRegistry);

    // This role allows your application code (on the container) to use other AWS services
    const taskRole = new Role(this, `${id}-task-role`, {
      roleName: id,
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
    });
    if (props.taskRolePolicys) {
      props.taskRolePolicys.forEach((policy: PolicyStatement) => {
        taskRole.addToPolicy(policy);
      });
    }

    // Create log group to store logs of the ECS service
    const logGroup = new LogGroup(this, `${id}-log-group`, {
      logGroupName: id,
      retention: RetentionDays.ONE_WEEK,
      removalPolicy: RemovalPolicy.DESTROY,
    });

    /**
     * Create task definition.
     */
    const taskDefinition = new FargateTaskDefinition(
      this,
      `${id}-task-definition`,
      {
        family: id,
        executionRole: props.ecsExecutionRole,
        taskRole: taskRole,
        cpu: props.cpu || 256,
        memoryLimitMiB: props.memoryLimitMiB || 1024,
      },
    );

    taskDefinition.addContainer(`${id}-container`, {
      image: containerImage,
      containerName: props.serviceName,
      portMappings: props.portMappings,
      environment: props.environment,
      logging: new AwsLogDriver({
        streamPrefix: props.serviceName,
        logGroup: logGroup,
      }),
      command: props.command || undefined,
    });

    // Create ECS service
    this.ecsService = new FargateService(this, `${id}-service`, {
      cluster: props.cluster!,
      taskDefinition,
      serviceName: id,
      desiredCount: props.serviceReplicas || 1,
      securityGroups: [props.ecsSg!],
      capacityProviderStrategies: [
        {
          capacityProvider:
            props.capacityProvider || ECS_CAPACITY_TYPE.FARGATE_SPOT,
          weight: 1,
        },
      ],
      serviceConnectConfiguration: props.enableServiceConnect
        ? {
          services: [
            {
              portMappingName: props.portMappings![0].name!,
              dnsName: props.serviceName,
              port: props.portMappings![0].containerPort,
            },
          ],
        }
        : undefined,
    });

    if (props.scalingCapacity?.enable) {
      const scaling = this.ecsService.autoScaleTaskCount({
        minCapacity: props.scalingCapacity.minCapacity || 1,
        maxCapacity: props.scalingCapacity.maxCapacity || 2,
      });
      if (props.scalingCapacity.cputargetValue) {
        scaling.scaleOnCpuUtilization('CpuScaling', {
          targetUtilizationPercent: props.scalingCapacity.cputargetValue,
          scaleInCooldown:
            props.scalingCapacity.scaleInCooldown || Duration.seconds(60),
          scaleOutCooldown:
            props.scalingCapacity.scaleOutCooldown || Duration.seconds(60),
        });
      }

      if (props.scalingCapacity.memorytargetValue) {
        scaling.scaleOnMemoryUtilization('MemoryScaling', {
          targetUtilizationPercent: props.scalingCapacity.memorytargetValue,
          scaleInCooldown:
            props.scalingCapacity.scaleInCooldown || Duration.seconds(60),
          scaleOutCooldown:
            props.scalingCapacity.scaleOutCooldown || Duration.seconds(60),
        });
      }
    }
  }
}
