// AWS CDK Modules
import { CfnOutput, Duration, Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { LambdaIntegration, RestApi, TokenAuthorizer } from 'aws-cdk-lib/aws-apigateway'
import { Table } from 'aws-cdk-lib/aws-dynamodb'
import { ManagedPolicy, Role, ServicePrincipal } from 'aws-cdk-lib/aws-iam'
import { NodejsFunction, NodejsFunctionProps } from 'aws-cdk-lib/aws-lambda-nodejs'
import { Secret } from 'aws-cdk-lib/aws-secretsmanager'

// Additional Modules
import { resolve } from 'path'

// Props for the Handler Construct
interface HandlerProps {
	table: Table
}

// Construct for the Handler
class Handler extends Construct {

	// Accessible properties by the parent
	create: NodejsFunction
	read: NodejsFunction
	update: NodejsFunction
	delete: NodejsFunction
	retrieve: NodejsFunction


  constructor(scope: Api, id: string, props: HandlerProps) {
    super(scope, id)

		// Role to assume for the Lambda Functions
		const role = new Role(this, 'Role', {
			assumedBy: new ServicePrincipal('lambda.amazonaws.com'),
			managedPolicies: [
				ManagedPolicy.fromAwsManagedPolicyName('AWSLambdaExecute')
			],
		})

		// API handlers can read and write on the table
		props.table.grantReadWriteData(role)

		// Common properties for all functions
		const handlerProps: NodejsFunctionProps = {
			environment: {
				TABLE_NAME: props.table.tableName,
			},
			role,
		}

		// Create function
		this.create = new NodejsFunction(this, 'Create', {
			...handlerProps,
			entry: resolve(__dirname, '../src/handlers/create.ts')
		})

		// Read function
		this.read = new NodejsFunction(this, 'Read', {
			...handlerProps,
			entry: resolve(__dirname, '../src/handlers/read.ts')
		})

		// Update function
		this.update = new NodejsFunction(this, 'Update', {
			...handlerProps,
			entry: resolve(__dirname, '../src/handlers/update.ts')
		})

		// Delete function
		this.delete = new NodejsFunction(this, 'Delete', {
			...handlerProps,
			entry: resolve(__dirname, '../src/handlers/delete.ts')
		})

		// Retrieve function
		this.retrieve = new NodejsFunction(this, 'Retrieve', {
			...handlerProps,
			entry: resolve(__dirname, '../src/handlers/retrieve.ts')
		})
	}
}

// Props for the Authorizer Construct
interface AuthorizerProps {

}

// Construct for the Authorizer
class Authorizer extends Construct {

	// Accessible properties by the parent
	authorizer: TokenAuthorizer

	constructor(scope: Api, id: string, props?: AuthorizerProps) {
		super(scope, id)

		// Generated secret token
		const token = new Secret(this, 'Token')

		// Lambda function for handling Authorization
		const authorizeHandler = new NodejsFunction(this, 'Handler', {
			entry: resolve(__dirname, '../src/handlers/authorize.ts'),
			environment: {
				SECRET_NAME: token.secretName,
			},
		})

		// Authorization handler can read token value
		token.grantRead(authorizeHandler)

		// API Gateway Authorizer component to attach to API methods
		this.authorizer = new TokenAuthorizer(this, 'Authorizer', {
			handler: authorizeHandler,
			identitySource: 'method.request.header.Authorization',
			resultsCacheTtl: Duration.minutes(0),
		})

		// Output the token name to CloudFormation
		new CfnOutput(this, 'TokenName', {
			value: token.secretName
		})
	}
}

// Props for the Api Construct
export interface ApiProps {
	table: Table,
}

// Construct for the Api
export class Api extends Construct {
  constructor(scope: Stack, id: string, props: ApiProps) {
    super(scope, id)

		// Initialize Handler Construct
		const handler = new Handler(this, 'Handler', {
			table: props.table,
		})

		// Initialize Authorizer Construct
		const { authorizer } = new Authorizer(this, 'Authorizer')

		// REST API with Edge-optimized Endpoint
		const api = new RestApi(this, 'Api', {

			defaultMethodOptions: {

				// Authorize each request with the Authorizer
				authorizer,
			},
		})

		// Make /{Id} resource and all methods for the API

		// API Resource {Id}
		const idResource = api.root.addResource('{Id}')

		// POST /
		api.root.addMethod('POST', new LambdaIntegration(handler.create))

		// GET /
		api.root.addMethod('GET', new LambdaIntegration(handler.read))

		// PUT /{Id}
		idResource.addMethod('PUT', new LambdaIntegration(handler.update))

		// DELETE /{Id}
		idResource.addMethod('DELETE', new LambdaIntegration(handler.delete))

		// GET /{Id}
		idResource.addMethod('GET', new LambdaIntegration(handler.retrieve))
  }
}