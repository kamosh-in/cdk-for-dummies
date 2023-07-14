import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda'

export const handler = async (event: APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
	return {
		principalId: 'user',
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: 'Allow',
					Resource: event.methodArn,
				}
			]
		}
	}
}