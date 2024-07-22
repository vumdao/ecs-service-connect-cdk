import {
  HostedZone,
  IHostedZone,
} from 'aws-cdk-lib/aws-route53';
import { Construct } from 'constructs';
import { EcsBlueprintsProps } from './utils';
import { SIMFLEXCLOUD_ZONE_ID, SIMFLEXCLOUD_ZONE_NAME } from '../../shared';

export class CreatePubHostedZone extends Construct {
  publicHostedZone: IHostedZone;

  constructor(scope: Construct, id: string, props: EcsBlueprintsProps) {
    super(scope, id);

    const prefix = `${props.reg.pattern}-sfc-${props.reg.envTag}-public-hosted-zone`;

    // Public hosted zone
    this.publicHostedZone = HostedZone.fromHostedZoneAttributes(
      this,
      `${prefix}-public-hosted-zone`,
      {
        hostedZoneId: SIMFLEXCLOUD_ZONE_ID,
        zoneName: SIMFLEXCLOUD_ZONE_NAME,
      },
    );
  }
}
