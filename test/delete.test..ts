// AWS Lambda Type Modules
import { APIGatewayProxyEvent } from 'aws-lambda'

// AWS SDK Modules
import { DeleteCommandOutput } from '@aws-sdk/lib-dynamodb'

// Local Modules
import { handler } from '../src/handlers/delete'
import { ddbDocClient } from '../src/lib/aws'

// A mocked output for Delete Command
const deleteCommandMock: DeleteCommandOutput = {
	$metadata: {},
}

// Initialize before each test
beforeAll(() => {
    jest.spyOn(ddbDocClient, 'send').mockImplementation(() => deleteCommandMock)
});

// Cleanup after each test
afterAll(() => {
    jest.restoreAllMocks();
});

test('Should succeed on well-formatted request', async () => {
	const event = {
		pathParameters: {
			Id: 'foo',
		},
	} as unknown as APIGatewayProxyEvent

	const expectedResult = {
		body: JSON.stringify({
			message: 'Delete succeeded'
		}, null, 2),
		statusCode: 200,
	}

	const result = await handler(event)
 
	expect(result).toStrictEqual(expectedResult)
})