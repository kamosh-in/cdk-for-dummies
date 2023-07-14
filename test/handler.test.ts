import { handler } from '../src/handlers'
import { ScanCommandOutput } from '@aws-sdk/lib-dynamodb'
import { ddbDocClient } from '../src/lib/aws';
import { APIGatewayProxyEvent } from 'aws-lambda';

const scanCommandMock: ScanCommandOutput = {
	$metadata: {},
	Items: [
		{
			Id: 'foo',
			Value: 'bar'
		},
		{
			Id: 'baz',
			Value: 'qux',
		},
	]
}

beforeAll(() => {
    jest.spyOn(ddbDocClient, 'send').mockImplementation(() => scanCommandMock);
});

afterAll(() => {
    jest.restoreAllMocks();
});

test('Should succeed on well-formatted request', async () => {
	const event = {} as APIGatewayProxyEvent

	const result = await handler(event)

	const { Items } = scanCommandMock
 
	expect(result).toStrictEqual({
		body: JSON.stringify({
			Items,
		}, null, 2),
		statusCode: 200,
	})
})