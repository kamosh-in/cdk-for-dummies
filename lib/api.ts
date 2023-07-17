// AWS CDK Modules
import { Duration, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { LambdaRestApi, RestApi, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway'
import { Table } from 'aws-cdk-lib/aws-dynamodb'
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'

// Additional Modules
import path from 'path'

// Props for the Api Construct
export interface ApiProps {
	table: Table,
}

// Construct for the Api
export class Api extends Construct {
  constructor(scope: Stack, id: string, props: ApiProps) {
    super(scope, id)

		// Proxy handler for the REST API
		const proxyHandler = new NodejsFunction(this, 'ProxyHandler', {
			entry: path.resolve(__dirname,'../src/handlers/index.ts'),
			environment: {
				TABLE_NAME: props.table.tableName,
			},
		})
		
		props.table.grantReadWriteData(proxyHandler)
		
		const token = new Secret(this, 'Token')

		const authorizeHandler = new NodejsFunction(this, 'AuthorizeHandler', {
			entry: path.resolve(__dirname, '../src/handlers/authorize.ts'),
			environment: {
				SECRET_NAME: token.secretName
			}
		})

		token.grantRead(authorizeHandler)

		const authorizer = new TokenAuthorizer(this, 'Authorizer', {
			handler: authorizeHandler,
			identitySource: 'method.request.header.Authorization',
			resultsCacheTtl: Duration.minutes(0),
		})

		const api = new RestApi(this, 'Gateway', {
			defaultMethodOptions: {
				authorizer,
			},
		})


  }
}