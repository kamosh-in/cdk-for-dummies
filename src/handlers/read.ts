// AWS Lambda Type Modules
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// AWS SDK Modules
import { ScanCommand, ScanCommandInput, ScanCommandOutput } from '@aws-sdk/lib-dynamodb'

// Local Modules
import { ddbDocClient } from '../lib/aws'
import { TABLE_NAME } from  '../lib/env'

const getInput = (event: APIGatewayProxyEvent, TableName: string): ScanCommandInput => {
	return {
		AttributesToGet: [
			'Id',
		],
		TableName,
	}
}

const getCommand = (input: ScanCommandInput): ScanCommand => {
	return new ScanCommand(input)
}

const getResult = (statusCode: number, response?: ScanCommandOutput): APIGatewayProxyResult => {
	let message
	if (statusCode === 200)
		message = response
	else
		message = 'Read failed'
	return {
		statusCode,
		body: JSON.stringify({
			message
		}, null, 2)
	}
}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		console.log(`EVENT:\n${JSON.stringify(event, null, 2)}`)
		const input = getInput(event, TABLE_NAME)
		console.log(`INPUT:\n${JSON.stringify(input, null, 2)}`)
		const command = getCommand(input)
		console.log(`COMMAND:\n${JSON.stringify(command, null, 2)}`)
		const response = await ddbDocClient.send(command)
		console.log(`RESPONSE:\n${JSON.stringify(response, null, 2)}`)
		return getResult(200, response)
	} catch (error) {
		console.log(`ERROR:\n${JSON.stringify(error, null, 2)}`)
		return getResult(400)
	}
}