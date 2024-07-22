import { Environment } from 'aws-cdk-lib';
import { CDK_DEFAULT_ACCOUNT, DEV_ENV_TAG, DEV_STAGE } from './constants';


export interface EnvironmentConfig extends Environment {
  pattern: string;
  envTag: string;
  owner: string;
  region: string;
  account: string;
  stage: string;
};

export const devEnv: EnvironmentConfig = {
  pattern: 'yelb',
  envTag: DEV_ENV_TAG,
  stage: DEV_STAGE,
  account: CDK_DEFAULT_ACCOUNT,
  region: "us-west-2",
  owner: 'development',
};