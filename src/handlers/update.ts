// AWS Lambda Type Modules
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// AWS SDK Modules
import { PutCommand, PutCommandInput } from '@aws-sdk/lib-dynamodb'

// Local Modules
import { ddbDocClient } from '../lib/aws/'
import { TABLE_NAME } from  '../lib/env'

// Get input for the Put Command
const getInput = (event: APIGatewayProxyEvent, TableName: string): PutCommandInput => {
	const { Item } = JSON.parse(event.body as string)
	const { Id } = event.pathParameters as { Id: string }
	const { Value } = Item
	return {

		// Prevents creating a new item
		ConditionExpression: 'attribute_exists(Id)',

		Item: {
			Id,
			Value,
		},
		TableName,
	}
}

// Get PutCommand for the DynamoDB Document Client to send
const getCommand = (input: PutCommandInput): PutCommand => {
	return new PutCommand(input)
}

// Get result for API Gateway
const getResult = (statusCode: number): APIGatewayProxyResult => {
	let message
	if (statusCode == 200)
		message = 'Update succeeded'
	else
		message = 'Update failed'
	return {
		body: JSON.stringify({
			message
		}, null, 2),
		statusCode,
	}
}

// Handler for PUT /{Id}
export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	try {
		console.log(`EVENT:\n${JSON.stringify(event, null, 2)}`)
		const input = getInput(event, TABLE_NAME)
		console.log(`INPUT:\n${JSON.stringify(input, null, 2)}`)
		const command = getCommand(input)
		console.log(`COMMAND:\n${JSON.stringify(command, null, 2)}`)
		const response = await ddbDocClient.send(command)
		console.log(`RESPONSE:\n${JSON.stringify(response, null, 2)}`)
		return getResult(200)
	} catch (error) {
		console.log(`ERROR:\n${JSON.stringify(error, null, 2)}`)
		return getResult(400)
	}
}