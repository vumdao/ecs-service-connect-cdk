import { Port, SecurityGroup, Vpc } from 'aws-cdk-lib/aws-ec2';
import { Construct } from 'constructs';
import { EnvironmentConfig } from '../../shared';

export class VpcProvider extends Construct {
  ecsVpc: Vpc;
  ecsSg: SecurityGroup;
  constructor(scope: Construct, id: string, reg: EnvironmentConfig) {
    super(scope, id);

    const prefix = `${reg.pattern}-sfc-${reg.envTag}`;

    this.ecsVpc = new Vpc(this, `${prefix}-vpc`, {
      natGateways: 1,
      maxAzs: 2,
    });

    this.ecsSg = new SecurityGroup(this, `${prefix}-ecs-sg`, {
      securityGroupName: `${prefix}-ecs-sg`,
      vpc: this.ecsVpc,
    });

    this.ecsSg.addIngressRule(this.ecsSg, Port.allTraffic(), 'Allow traffic within the security group');
  }
}
