import { App } from 'aws-cdk-lib';
import { Template } from 'aws-cdk-lib/assertions';
import { devEnv, TagsProp } from '../src/lib/shared';
import { EcsBlueprintsStack } from '../src/lib/stacks/ecs-blueprints-stack';

test(`${devEnv.pattern}-Snapshot`, () => {
  const app = new App();
  const stack = new EcsBlueprintsStack(app, 'EcsBlueprintsStack', devEnv, { env: devEnv, tags: TagsProp('ecs-sc', devEnv) });

  const template = Template.fromStack(stack);
  expect(template.toJSON()).toMatchSnapshot();
});