import { AppProtocol } from 'aws-cdk-lib/aws-ecs';
import { EcsServiceProps } from '../../resources';

export const UI_SERVICE: EcsServiceProps = {
  serviceName: 'yelb-ui',
  onlineRegistry: 'mreferre/yelb-ui:0.10',
  portMappings: [{ name: 'yelb-ui', containerPort: 80, appProtocol: AppProtocol.http }],
  environment: {
    APP_SERVER: 'yelb-appserver',
    APP_SERVER_PORT: '4567',
  },
  targetGroups: [{
    publicPort: 80,
    healthCheckPath: '/',
  }],
  enableServiceConnect: true,
  serviceReplicas: 2,
};