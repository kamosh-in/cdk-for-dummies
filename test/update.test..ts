// AWS Lambda Type Modules
import { APIGatewayProxyEvent } from 'aws-lambda'

// AWS SDK Modules
import { PutCommandOutput } from '@aws-sdk/lib-dynamodb'

// Local Modules
import { handler } from '../src/handlers/update'
import { ddbDocClient } from '../src/lib/aws'

// A mocked output for Put Command
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
				Value: 'bar',
			},
		}),
		pathParameters: {
			Id: 'foo',
		},
	} as unknown as APIGatewayProxyEvent

	const expectedResult = {
		body: JSON.stringify({
			message: 'Update succeeded'
		}, null, 2),
		statusCode: 200,
	}

	const result = await handler(event)
 
	expect(result).toStrictEqual(expectedResult)
})