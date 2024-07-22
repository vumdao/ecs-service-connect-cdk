import { Duration } from 'aws-cdk-lib';
import { SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, PortMapping } from 'aws-cdk-lib/aws-ecs';
import { PolicyStatement, Role } from 'aws-cdk-lib/aws-iam';
import { EnvironmentConfig } from '../../../shared';

export enum ECS_CAPACITY_TYPE {
  EC2 = 'EC2',
  FARGATE = 'FARGATE',
  FARGATE_SPOT = 'FARGATE_SPOT',
}

export interface ScalingCapacity {
  /**
   * Enable autoscaling
   * @default false
   */
  enable?: boolean;

  /**
   * The minimum number of tasks to run
   * @default 1
   */
  minCapacity?: number;

  /**
   * The maximum number of tasks to run
   */
  maxCapacity: number;

  /**
   * The target value for CPU utilization across all tasks in the service.
   */
  cputargetValue?: number;

  /**
   * The target value for memory utilization across all tasks in the service.
   */
  memorytargetValue?: number;

  /**
   * The cooldown period for the service to scale in
   */
  scaleInCooldown?: Duration;

  /**
   * The cooldown period for the service to scale out
   */
  scaleOutCooldown?: Duration;
}

export interface EcsServiceProps extends EcsBluepritnsServiceProps {
  /**
   * Target groups which created for loadbalancer
   */
  targetGroups?: [{ publicPort: number; healthCheckPath: string }];
}

export interface EcsBluepritnsServiceProps {
  /**
   * Service name.
   */
  serviceName: string;

  /**
   * ECS execution role. The role will be used to retrieve container images from ECR and create CloudWatch log groups.
   */
  ecsExecutionRole?: Role;

  /**
   * Task role policies which will be attached to the task role.
   * This role allows your application code (on the container) to use other AWS services
   */
  taskRolePolicys?: PolicyStatement[];

  /**
   * The number of cpu units used by the task
   */
  cpu?: number;

  /**
   * The amount (in MiB) of memory used by the task.
   */
  memoryLimitMiB?: number;

  /**
   * The environment variables to pass to the container
   */
  environment?: { [key: string]: string };

  /**
   * Image tag of ECR repo of the service
   */
  imageTag?: string;

  /**
   * Port mapping
   */
  portMappings?: PortMapping[];

  /**
   * ECS cluster
   */
  cluster?: Cluster;

  /**
   * Security group
   */
  ecsSg?: SecurityGroup;

  /**
   * The desired number of instantiations of the task definition to keep running on the service.
   */
  serviceReplicas?: number;

  /**
   * Allow FARAGATE_SPOT capacity provider
   */
  capacityProvider?: string;

  /**
   * Reference an image on DockerHub or another online registry.
   * Only one of ecrRepositoryName or onlineRegistry is used. If both are provided, ecrRepositoryName is used.
   */
  onlineRegistry: string;

  /**
   * Service connect
   */
  enableServiceConnect?: boolean;

  /**
   * The command that is passed to the container
   */
  command?: string[];

  /**
   * Autoscaling
   * @default false Disable
   */
  scalingCapacity?: ScalingCapacity;
}

export interface EcsBlueprintsProps {
  reg: EnvironmentConfig;
  ecsVpc: Vpc;
  ecsSg: SecurityGroup;
}
