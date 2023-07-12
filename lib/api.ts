// AWS CDK Libraries
import { Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'

// Props for the Api Construct
export interface ApiProps {}

// Construct for the Api
export class Api extends Construct {
  constructor(scope: Stack, id: string, props: ApiProps) {
    super(scope, id)

  }
}