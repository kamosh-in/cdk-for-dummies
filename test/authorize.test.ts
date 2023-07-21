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

// Constant Method ARN for tests
const METHOD_ARN = 'bar'

// Assert positive tests to this result
const successfulResult: APIGatewayAuthorizerResult = {
	policyDocument: {
		Version: '2012-10-17',
		Statement: [
			{
				Action: 'execute-api:Invoke',
				Effect: 'Allow',
				Resource: METHOD_ARN,
			}
		],
	},
	principalId: 'user',
}

// Assert negative tests to this result
const failedResult: APIGatewayAuthorizerResult = {
	policyDocument: {
		Version: '2012-10-17',
		Statement: [
			{
				Action: 'execute-api:Invoke',
				Effect: 'Deny',
				Resource: METHOD_ARN,
			}
		],
	},
	principalId: 'user',
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
		methodArn: METHOD_ARN,
		type: 'TOKEN',
	}

	const result = await handler(event)

	expect(result).toStrictEqual(successfulResult)
})

test('Should fail on incorrect token', async () => {
	const event: APIGatewayTokenAuthorizerEvent = {
		authorizationToken: 'baz',
		methodArn: METHOD_ARN,
		type: 'TOKEN',
	}

	const result = await handler(event)

	expect(result).toStrictEqual(failedResult)
})

test('Should fail on no token', async () => {
	const event = {
		methodArn: METHOD_ARN,
		type: 'TOKEN',
	} as APIGatewayTokenAuthorizerEvent

	const result = await handler(event)

	expect(result).toStrictEqual(failedResult)
})