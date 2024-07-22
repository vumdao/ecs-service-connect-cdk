import { NagPackSuppression } from 'cdk-nag';

export const NagPackSuppressions: NagPackSuppression[] = [
  {
    id: 'AwsSolutions-VPC7',
    reason: 'The VPC does not have an associated Flow Log.',
  },
  {
    id: 'AwsSolutions-ECS4',
    reason: 'The ECS Cluster has CloudWatch Container Insights disabled.',
  },
  {
    id: 'AwsSolutions-IAM4',
    reason: 'The IAM user, role, or group uses AWS managed policies.',
  },
  {
    id: 'AwsSolutions-IAM5',
    reason: 'The IAM entity contains wildcard permissions',
  },
  {
    id: 'AwsSolutions-IAM6',
    reason: 'The IAM entity has inline policies attached.',
  },
  { id: 'AwsSolutions-EC23', reason: 'Expose port 443 in ALB' },
  {
    id: 'AwsSolutions-ELB2',
    reason: 'The ELB does not have access logs enabled.',
  },
  {
    id: 'AwsSolutions-AEC5',
    reason: 'The ElastiCache cluster uses the default endpoint port.',
  },
  {
    id: 'AwsSolutions-AEC6',
    reason:
      'The ElastiCache Redis cluster does not use Redis AUTH for user authentication.',
  },
  {
    id: 'AwsSolutions-SMG4',
    reason: 'The secret does not have automatic rotation scheduled.',
  },
  {
    id: 'AwsSolutions-RDS4',
    reason: 'The RDS DB instance does not have deletion protection enabled.',
  },
  {
    id: 'AwsSolutions-RDS10',
    reason:
      'The RDS instance or Aurora DB cluster does not have deletion protection enabled.',
  },
  {
    id: 'AwsSolutions-RDS11',
    reason:
      'The RDS instance or Aurora DB cluster uses the default endpoint port.',
  },
  {
    id: 'AwsSolutions-RDS12',
    reason:
      'The RDS instance or Aurora DB cluster does not use SSL for data in transit.',
  },
  {
    id: 'AwsSolutions-AEC4',
    reason:
      'The ElastiCache Redis cluster is not deployed in a Multi-AZ configuration.',
  },
  {
    id: 'AwsSolutions-S1',
    reason: 'The S3 Bucket has server access logs disabled.',
  },
  {
    id: 'AwsSolutions-EC29', reason: 'The EC2 instance is not part of an ASG and has Termination Protection disabled.',
  },
  {
    id: 'AwsSolutions-EC28', reason: 'The EC2 instance/AutoScaling launch configuration does not have detailed monitoring enabled.',
  },
  {
    id: 'AwsSolutions-ECS2', reason: 'The ECS Task Definition includes a container definition that directly specifies environment variables.',
  },
];
