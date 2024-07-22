import { awscdk, javascript } from 'projen';
import { UpdateSnapshot } from 'projen/lib/javascript';
const project = new awscdk.AwsCdkTypeScriptApp({
  cdkVersion: '2.149.0',
  defaultReleaseBranch: 'master',
  appEntrypoint: 'bin/main.ts',
  deps: ['cdk-nag', 'typescript@4.3.5'],
  github: false,
  name: 'ecs-service-connect',
  packageManager: javascript.NodePackageManager.PNPM,
  projenrcTs: true,
  jestOptions: {
    updateSnapshot: UpdateSnapshot.NEVER,
  },
});
project.synth();