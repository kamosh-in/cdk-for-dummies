// AWS Lambda Type Modules
import { APIGatewayProxyEvent } from 'aws-lambda'

// AWS SDK Modules
import { GetCommandOutput } from '@aws-sdk/lib-dynamodb'

// Local Modules
import { handler } from '../src/handlers/retrieve'
import { ddbDocClient } from '../src/lib/aws'

// A mocked output for Get Command
const getCommandMock: GetCommandOutput = {
	$metadata: {},
	Item: {
		Id: 'foo',
		Value: 'bar'
	}
}

// Initialize before each test
beforeAll(() => {
    jest.spyOn(ddbDocClient, 'send').mockImplementation(() => getCommandMock)
});

// Cleanup after each test
afterAll(() => {
    jest.restoreAllMocks();
});

test('Should succeed on well-formatted request', async () => {
	const event = {
		pathParameters: {
			Id: 'foo'
		}
	} as unknown as APIGatewayProxyEvent

	const expectedResult = {
		body: JSON.stringify({
			message: getCommandMock.Item
		}, null, 2),
		statusCode: 200,
	}

	const result = await handler(event)
 
	expect(result).toStrictEqual(expectedResult)
})