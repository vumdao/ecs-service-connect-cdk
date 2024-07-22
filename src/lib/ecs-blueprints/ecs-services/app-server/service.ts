import { AppProtocol } from 'aws-cdk-lib/aws-ecs';
import { EcsServiceProps } from '../../resources';

export const APP_SERVER_SERVICE: EcsServiceProps = {
  serviceName: 'yelb-appserver',
  onlineRegistry: 'mreferre/yelb-appserver:0.7',
  portMappings: [{ name: 'yelb-appserver', containerPort: 4567, appProtocol: AppProtocol.http }],
  environment: {
    APP_PORT: '4567',
    YELB_DB_SERVER: 'yelb-db',
    YELB_DB_SERVER_PORT: '5432',
    YELB_REDIS_SERVER: 'yelb-redis',
    YELB_REDIS_SERVER_PORT: '6379',
  },
  enableServiceConnect: true,
  scalingCapacity: {
    enable: true,
    minCapacity: 1,
    maxCapacity: 3,
    cputargetValue: 50,
  },
};