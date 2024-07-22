import { EcsServiceProps } from '../../resources';

export const REDIS_SERVICE: EcsServiceProps = {
  serviceName: 'yelb-redis',
  onlineRegistry: 'redis:4.0.2',
  portMappings: [{ name: 'yelb-redis', containerPort: 6379 }],
  environment: {
    ALLOW_EMPTY_PASSWORD: 'yes',
  },
  enableServiceConnect: true,
  memoryLimitMiB: 2048,
  cpu: 512,
};