// AWS CDK Packages
import { Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { LambdaRestApi } from 'aws-cdk-lib/aws-apigateway'
import { Table } from 'aws-cdk-lib/aws-dynamodb'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'

// Additional Packages
import path from 'path'

// Props for the Api Construct
export interface ApiProps {
	table: Table
}

// Construct for the Api
export class Api extends Construct {
  constructor(scope: Stack, id: string, props: ApiProps) {
    super(scope, id)

		const handler = new NodejsFunction(this, 'Handler', {
			entry: path.resolve(__dirname,'../src/index.ts'),
			environment: {
				TABLE_NAME: props.table.tableName
			}
		})

		props.table.grantReadWriteData(handler)

		new LambdaRestApi(this, 'Gateway', {
			handler
		})
  }
}