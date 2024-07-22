import { Duration } from 'aws-cdk-lib';
import { Cluster } from 'aws-cdk-lib/aws-ecs';
import {
  ApplicationProtocol,
  Protocol,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam';
import { CnameRecord } from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { SIMFLEXCLOUD_ZONE_NAME } from '../../shared';
import { APP_SERVER_SERVICE } from '../ecs-services/app-server/service';
import { DB_SERVICE } from '../ecs-services/db/service';
import { REDIS_SERVICE } from '../ecs-services/redis-server/service';
import { UI_SERVICE } from '../ecs-services/ui/service';
import { CreateApplicationLoadBalancer } from './alb';
import { CreatePubHostedZone } from './public-hosted-zone';
import { CreateEcsFargateService, EcsBlueprintsProps } from './utils';

export class EcsClusterProvider extends Construct {
  constructor(scope: Construct, id: string, props: EcsBlueprintsProps) {
    super(scope, id);

    const prefix = `${props.reg?.pattern}-sfc-${props.reg?.envTag}`;

    const cluster = new Cluster(this, `${prefix}-ecs-cluster`, {
      clusterName: prefix,
      vpc: props.ecsVpc,
    });
    cluster.addDefaultCloudMapNamespace({
      name: 'yelb',
      useForServiceConnect: true,
    });

    // This role allows Amazon ECS to use other AWS services on your behalf.
    const ecsExecutionRole = new Role(this, `${prefix}-ecs-role`, {
      roleName: `${prefix}-task-execution-role`,
      assumedBy: new ServicePrincipal('ecs-tasks.amazonaws.com'),
      managedPolicies: [
        ManagedPolicy.fromAwsManagedPolicyName(
          'service-role/AmazonECSTaskExecutionRolePolicy',
        ),
      ],
    });

    const alb = new CreateApplicationLoadBalancer(this, `${prefix}-ecs-alb`, {
      ...props,
    });

    [APP_SERVER_SERVICE, DB_SERVICE, REDIS_SERVICE, UI_SERVICE].forEach(
      (service) => {
        var _service = new CreateEcsFargateService(
          this,
          `${prefix}-ecs-service-${service.serviceName}`,
          {
            ...props,
            ...service,
            ecsExecutionRole,
            cluster,
          },
        );

        if (service.targetGroups) {
          service.targetGroups.forEach((target) => {
            alb.httpsListener.addTargets(
              `${prefix}-ecs-target-${service.serviceName}-${target.publicPort}`,
              {
                port: target.publicPort,
                protocol: ApplicationProtocol.HTTP,
                targets: [_service.ecsService],
                healthCheck: {
                  protocol: Protocol.HTTP,
                  path: target.healthCheckPath ? target.healthCheckPath : '/',
                  interval: Duration.seconds(10),
                  timeout: Duration.seconds(5),
                  healthyThresholdCount: 2,
                  unhealthyThresholdCount: 2,
                  healthyHttpCodes: '200',
                },
                deregistrationDelay: Duration.seconds(30),
              },
            );
          });
        }
      },
    );

    // Create public hostedzone and CNAME to point to the ALB DNS
    const publicHostedZone = new CreatePubHostedZone(
      this,
      `${prefix}-hosted-zone`,
      {
        ...props,
      },
    );

    new CnameRecord(this, `${prefix}-cname`, {
      zone: publicHostedZone.publicHostedZone,
      recordName: `yelb.${SIMFLEXCLOUD_ZONE_NAME}`,
      domainName: alb.albDomainName,
    });
  }
}
