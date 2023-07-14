// AWS Lambda Type Packages
import { APIGatewayProxyHandler } from 'aws-lambda'

// AWS SDK Packages
import { ScanCommand } from '@aws-sdk/client-dynamodb'

// Local Packages
import { ddbDocClient } from '../lib/aws'
import { TABLE_NAME } from '../lib/env'

export const handler: APIGatewayProxyHandler = async (event) => {
	console.log(`EVENT: \n ${JSON.stringify(event, null, 2)}`)

	const result = await ddbDocClient.send(new ScanCommand({
		AttributesToGet: [
			'Id'
		],
		TableName: TABLE_NAME,
	}))

	return {
		statusCode: 200,
		body: JSON.stringify({
			message: 'This is the Scan result',
			result
		}, null, 2)
	}
};