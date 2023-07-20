import { handler } from '../src/handlers/authorize'
import { secretsManagerClient } from '../src/lib/aws';
import { APIGatewayAuthorizerEvent } from 'aws-lambda';

beforeAll(() => {
    jest.spyOn(secretsManagerClient, 'send').mockImplementation(() => {
			return {
				SecretString: 'foo'
			}
		});
});

afterAll(() => {
    jest.restoreAllMocks();
});

test('Should succeed on correct token', async () => {
	const event: APIGatewayAuthorizerEvent = {
		type: 'TOKEN',
		authorizationToken: 'foo',
		methodArn: 'bar'
	}

	const result = await handler(event)
	console.log(result)
	expect(result).toStrictEqual({
		principalId: 'user',
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: 'Allow',
					Resource: event.methodArn
				}
			]
		}
	})
})

test('Should fail on incorrect token', async () => {
	const event: APIGatewayAuthorizerEvent = {
		type: 'TOKEN',
		authorizationToken: 'baz',
		methodArn: 'bar'
	}

	const result = await handler(event)
	console.log(result)
	expect(result).toStrictEqual({
		principalId: 'user',
		policyDocument: {
			Version: '2012-10-17',
			Statement: [
				{
					Action: 'execute-api:Invoke',
					Effect: 'Deny',
					Resource: event.methodArn
				}
			]
		}
	})
})