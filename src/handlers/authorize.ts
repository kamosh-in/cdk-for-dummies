// AWS Lambda Type Packages
import { APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda'

// AWS SDK Packages
import { GetSecretValueCommand, GetSecretValueCommandInput, GetSecretValueCommandOutput } from '@aws-sdk/client-secrets-manager'

// Local Packages
import { secretsManagerClient } from '../lib/aws/'
import { SECRET_NAME } from  '../lib/env'

const getInput = (SecretId: string): GetSecretValueCommandInput => {
	return {
		SecretId
	}
}

const getCommand = (input: GetSecretValueCommandInput): GetSecretValueCommand => {
	return new GetSecretValueCommand(input)
}

const getResult = (event: APIGatewayTokenAuthorizerEvent, response: GetSecretValueCommandOutput): APIGatewayAuthorizerResult => {
	let Effect = 'Deny'
	if (response.SecretString == event.authorizationToken)
		Effect = 'Allow'

	return {
		principalId: 'user',
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect,
					Resource: event.methodArn
				}
			]
		}
	}
}

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
	console.log(`EVENT:\n${JSON.stringify(event, null, 2)}`)
	const input = getInput(SECRET_NAME)
	const command = getCommand(input)
	const response = await secretsManagerClient.send(command)
	return getResult(event, response)
}