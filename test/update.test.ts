// AWS Lambda Type Modules
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// AWS SDK Modules
import { PutCommandOutput } from '@aws-sdk/lib-dynamodb'

// Local Modules
import { handler } from '../src/handlers/update'
import { ddbDocClient } from '../src/lib/aws'

// A mocked output for Put Command
const putCommandMock: PutCommandOutput = {
	$metadata: {},
}

// Assert positive tests to this result
const successfulResult: APIGatewayProxyResult = {
	body: JSON.stringify({
		message: 'Update succeeded'
	}, null, 2),
	statusCode: 200,
}

// Assert negative tests to this result
const failedResult: APIGatewayProxyResult = {
	body: JSON.stringify({
		message: 'Update failed'
	}, null, 2),
	statusCode: 400,
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

	const result = await handler(event)
 
	expect(result).toStrictEqual(successfulResult)
})

test('Should fail on missing Id', async () => {
	const event = {
		body: JSON.stringify({
			Item: {
				Value: 'bar',
			},
		}),
		pathParameters: {},
	} as APIGatewayProxyEvent

	const result = await handler(event)
 
	expect(result).toStrictEqual(failedResult)
})

test('Should fail on missing Value', async () => {
	const event = {
		body: JSON.stringify({
			Item: {},
		}),
		pathParameters: {
			Id: 'foo',
		},
	} as unknown as APIGatewayProxyEvent

	const result = await handler(event)
 
	expect(result).toStrictEqual(failedResult)
})

test('Should fail on missing Item', async () => {
	const event = {
		body: JSON.stringify({}),
		pathParameters: {
			Id: 'foo',
		},
	} as unknown as APIGatewayProxyEvent

	const result = await handler(event)
 
	expect(result).toStrictEqual(failedResult)
})