// AWS Lambda Type Modules
import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda'

// AWS SDK Modules
import { GetSecretValueCommand, GetSecretValueCommandInput, GetSecretValueCommandOutput } from '@aws-sdk/client-secrets-manager'

// Local Modules
import { secretsManagerClient } from '../lib/aws/'
import { SECRET_NAME } from  '../lib/env'

// Get input for the GetSecretValue Command
const getInput = (SecretId: string): GetSecretValueCommandInput => {
	return {
		SecretId
	}
}

// Get GetSecretValueCommand for the DynamoDB Document Client to send
const getCommand = (input: GetSecretValueCommandInput): GetSecretValueCommand => {
	return new GetSecretValueCommand(input)
}

// Get result for API Gateway Authorizer
const getResult = (event: APIGatewayTokenAuthorizerEvent, response: GetSecretValueCommandOutput): APIGatewayAuthorizerResult => {
	let Effect = 'Deny'
	if (response.SecretString === event.authorizationToken)
		Effect = 'Allow'

	return {
		policyDocument: {
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect,
					Resource: event.methodArn
				}
			],
			Version: '2012-10-17',
		},
		principalId: 'user',
	}
}

// Handler for Authorization
export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
	console.log(`EVENT:\n${JSON.stringify(event, null, 2)}`)
	const input = getInput(SECRET_NAME)
	const command = getCommand(input)
	const response = await secretsManagerClient.send(command)
	return getResult(event, response)
}