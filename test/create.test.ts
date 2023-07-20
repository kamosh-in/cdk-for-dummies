// AWS Lambda Type Modules
import { APIGatewayProxyEvent } from 'aws-lambda'

// AWS SDK Modules
import { PutCommandOutput } from '@aws-sdk/lib-dynamodb'

// Local Modules
import { handler } from '../src/handlers/create'
import { ddbDocClient } from '../src/lib/aws'

// A mocked output for Scan Command
const putCommandMock: PutCommandOutput = {
	$metadata: {},
}

// Initialize before each test
beforeAll(() => {
    jest.spyOn(ddbDocClient, 'send').mockImplementation(() => putCommandMock)
});

// Cleanup after each test
afterAll(() => {
    jest.restoreAllMocks();
});

test('Should succeed on well-formatted request', async () => {
	const event = {
		body: JSON.stringify({
			Item: {
				Id: 'foo',
				Value: 'bar',
			},
		}),
	} as APIGatewayProxyEvent

	const expectedResult = {
		body: JSON.stringify({
			message: 'Create succeeded'
		}, null, 2),
		statusCode: 200,
	}

	const result = await handler(event)
 
	expect(result).toStrictEqual(expectedResult)
})