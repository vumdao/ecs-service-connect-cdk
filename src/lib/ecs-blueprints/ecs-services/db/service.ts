import { EcsServiceProps } from '../../resources';

export const DB_SERVICE: EcsServiceProps = {
  serviceName: 'yelb-db',
  onlineRegistry: 'mreferre/yelb-db:0.6',
  portMappings: [{ name: 'yelb-db', containerPort: 5432 }],
  enableServiceConnect: true,
};