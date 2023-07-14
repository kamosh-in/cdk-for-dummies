// AWS Lambda Type Packages
import { APIGatewayProxyHandler } from 'aws-lambda'

// AWS SDK Packages
import { ScanCommand } from '@aws-sdk/client-dynamodb'

// Local Packages
import { ddbDocClient } from '../lib/aws'
import { TABLE_NAME } from '../lib/env'

export const handler: APIGatewayProxyHandler = async (event, context, callback) => {
	console.info(`EVENT: \n ${JSON.stringify(event, null, 2)}`)
	console.info(`CONTEXT: \n ${JSON.stringify(context, null, 2)}`)
	console.info(`CALLBACK: \n ${JSON.stringify(callback, null, 2)}`)

	const result = await ddbDocClient.send(new ScanCommand({
		AttributesToGet: [
			'Id'
		],
		TableName: TABLE_NAME,
	}))

	return {
		statusCode: 200,
		body: JSON.stringify({
			Items: result.Items
		}, null, 2)
	}
};