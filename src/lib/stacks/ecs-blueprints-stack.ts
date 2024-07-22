import { Aspects, Stack, StackProps } from 'aws-cdk-lib';
import { AwsSolutionsChecks, NagSuppressions } from 'cdk-nag';
import { Construct } from 'constructs';
import { NagPackSuppressions } from './nag-suppressions';
import {
  EcsBlueprintsProps,
  EcsClusterProvider,
  VpcProvider,
} from '../ecs-blueprints';
import { EnvironmentConfig } from '../shared';

export class EcsBlueprintsStack extends Stack {
  constructor(
    scope: Construct,
    id: string,
    reg: EnvironmentConfig,
    props: StackProps,
  ) {
    super(scope, id, props);

    const vpc = new VpcProvider(this, `${reg.pattern}-vpc-provider`, reg);

    const vpcProvider: EcsBlueprintsProps = {
      reg,
      ecsVpc: vpc.ecsVpc,
      ecsSg: vpc.ecsSg,
    };

    new EcsClusterProvider(this, `${reg.pattern}-ecs-cluster`, {
      ...vpcProvider,
    });

    Aspects.of(this).add(new AwsSolutionsChecks());

    NagSuppressions.addResourceSuppressions(this, NagPackSuppressions, true);
  }
}
