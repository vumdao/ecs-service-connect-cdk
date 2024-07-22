import { App } from 'aws-cdk-lib';
import { devEnv } from '../lib/shared';
import { EcsBlueprintsStack } from '../lib/stacks/ecs-blueprints-stack';

const app = new App();

new EcsBlueprintsStack(app, 'EcsBlueprintsStack', devEnv, { env: devEnv });
