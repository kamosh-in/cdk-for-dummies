// AWS Lambda Type Packages
import { APIGatewayProxyEvent, APIGatewayProxyHandler, APIGatewayProxyHandlerV2, APIGatewayProxyResult } from 'aws-lambda'

// AWS SDK Packages
import { ScanCommand } from '@aws-sdk/client-dynamodb'

// Local Packages
import { ddbDocClient } from '../lib/aws'
import { TABLE_NAME } from '../lib/env'

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	console.info(`EVENT: \n ${JSON.stringify(event, null, 2)}`)

	const result = await ddbDocClient.send(new ScanCommand({
		AttributesToGet: [
			'Id',
		],
		TableName: TABLE_NAME,
	}))

	const { Items } = result

	return {
		body: JSON.stringify({
			Items,
		}, null, 2),
		statusCode: 200,
	}
};