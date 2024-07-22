import {
  Certificate,
  CertificateValidation,
} from 'aws-cdk-lib/aws-certificatemanager';
import { Peer, Port, SecurityGroup } from 'aws-cdk-lib/aws-ec2';
import {
  ApplicationListener,
  ApplicationLoadBalancer,
  ApplicationProtocol,
  SslPolicy,
} from 'aws-cdk-lib/aws-elasticloadbalancingv2';
import { Construct } from 'constructs';
import { CreatePubHostedZone } from './public-hosted-zone';
import { EcsBlueprintsProps } from './utils';
import { SIMFLEXCLOUD_ZONE_NAME } from '../../shared';

export class CreateApplicationLoadBalancer extends Construct {
  httpsListener: ApplicationListener;
  albDomainName: string;
  constructor(scope: Construct, id: string, props: EcsBlueprintsProps) {
    super(scope, id);

    const ecsHostedZone = new CreatePubHostedZone(this, 'hosted-zone', props);

    const acm = new Certificate(this, 'acm', {
      domainName: `*.${SIMFLEXCLOUD_ZONE_NAME}`,
      validation: CertificateValidation.fromDns(ecsHostedZone.publicHostedZone),
    });

    const albSG = new SecurityGroup(this, 'alb-sg', {
      securityGroupName: `${id}-alb`,
      vpc: props.ecsVpc,
    });
    albSG.addIngressRule(
      Peer.anyIpv4(),
      Port.tcp(443),
      'Allow traffic from anywhere to NLB',
    );

    const alb = new ApplicationLoadBalancer(this, 'alb', {
      vpc: props.ecsVpc,
      internetFacing: true,
      loadBalancerName: id,
      securityGroup: albSG,
    });

    this.httpsListener = alb.addListener('httpsListener', {
      port: 443,
      protocol: ApplicationProtocol.HTTPS,
      certificates: [acm],
      sslPolicy: SslPolicy.RECOMMENDED,
      open: true,
    });

    alb.addRedirect({
      sourceProtocol: ApplicationProtocol.HTTP,
      sourcePort: 80,
      targetProtocol: ApplicationProtocol.HTTPS,
      targetPort: 443,
      open: true,
    });

    this.albDomainName = alb.loadBalancerDnsName;
  }
}
