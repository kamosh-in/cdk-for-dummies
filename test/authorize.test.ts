// AWS Lambda Type Modules
import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from 'aws-lambda'

// AWS SDK Modules
import { GetSecretValueCommandOutput } from '@aws-sdk/client-secrets-manager';

// Local Modules
import { handler } from '../src/handlers/authorize'
import { secretsManagerClient } from '../src/lib/aws'

// A mocked output for GetSecretValue Command
const getSecretValueCommandMock: GetSecretValueCommandOutput = {
	$metadata: {},
	SecretString: 'foo',
}

// Initialize before each test
beforeAll(() => {
    jest.spyOn(secretsManagerClient, 'send').mockImplementation(() => getSecretValueCommandMock)
});

// Cleanup after each test
afterAll(() => {
    jest.restoreAllMocks();
});

test('Should succeed on correct token', async () => {
	const event: APIGatewayTokenAuthorizerEvent = {
		authorizationToken: 'foo',
		methodArn: 'bar',
		type: 'TOKEN',
	}

	const expectedResult = {
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: 'Allow',
					Resource: event.methodArn,
				}
			],
		},
		principalId: 'user',
	}

	const result = await handler(event)
	expect(result).toStrictEqual(expectedResult)
})

test('Should fail on incorrect token', async () => {
	const event: APIGatewayTokenAuthorizerEvent = {
		authorizationToken: 'baz',
		methodArn: 'bar',
		type: 'TOKEN',
	}

	const expectedResult = {
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: 'Deny',
					Resource: event.methodArn,
				}
			],
		},
		principalId: 'user',
	}

	const result = await handler(event)
	console.log(result)
	expect(result).toStrictEqual(expectedResult)
})

test('Should fail on no token', async () => {
	const event = {
		methodArn: 'bar',
		type: 'TOKEN',
	} as APIGatewayTokenAuthorizerEvent

	const expectedResult: APIGatewayAuthorizerResult = {
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: 'Deny',
					Resource: event.methodArn,
				}
			],
		},
		principalId: 'user',
	}

	const result = await handler(event)
	console.log(result)
	expect(result).toStrictEqual(expectedResult)
})