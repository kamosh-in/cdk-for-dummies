// AWS CDK Libraries
import { Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

// Additional Libraries
import path from 'path'

// Props for the Api Construct
export interface ApiProps {}

// Construct for the Api
export class Api extends Construct {
  constructor(scope: Stack, id: string, props?: ApiProps) {
    super(scope, id)

		new NodejsFunction(this, 'HelloFunction', {
			entry: path.resolve(__dirname,'../src/hello.ts')
		})
  }
}