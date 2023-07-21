// AWS Lambda Type Modules
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// AWS SDK Modules
import { ScanCommandOutput } from '@aws-sdk/lib-dynamodb'

// Local Modules
import { handler } from '../src/handlers/read'
import { ddbDocClient } from '../src/lib/aws';

// A mocked output for Scan Command
const scanCommandMock: ScanCommandOutput = {
	$metadata: {},
	Items: [
		{
			Id: 'foo',
			Value: 'bar',
		},
		{
			Id: 'baz',
			Value: 'qux',
		},
	]
}

// Assert positive tests to this result
const successfulResult: APIGatewayProxyResult = {
	body: JSON.stringify({
		message: scanCommandMock.Items
	}, null, 2),
	statusCode: 200,
}

// // Assert negative tests to this result
// const failedResult: APIGatewayProxyResult = {
// 	body: JSON.stringify({
// 		message: 'Read failed'
// 	}, null, 2),
// 	statusCode: 400,
// }

// Initialize before each test
beforeAll(() => {
    jest.spyOn(ddbDocClient, 'send').mockImplementation(() => scanCommandMock)
});

// Cleanup after each test
afterAll(() => {
    jest.restoreAllMocks();
});

test('Should succeed on well-formatted request', async () => {
	const event = {} as APIGatewayProxyEvent

	const result = await handler(event)
 
	expect(result).toStrictEqual(successfulResult)
})