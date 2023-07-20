// AWS Lambda Type Modules
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// AWS SDK Modules
import { DeleteCommand, DeleteCommandInput } from '@aws-sdk/lib-dynamodb'

// Local Modules
import { ddbDocClient } from '../lib/aws'
import { TABLE_NAME } from  '../lib/env'

// Get input for the Delete Command
const getInput = (event: APIGatewayProxyEvent, TableName: string): DeleteCommandInput => {
	const Key = event.pathParameters as { Id: string }
	return {
		Key,
		TableName,
	}
}

// Get DeleteCommand for the DynamoDB Document Client to send
const getCommand = (input: DeleteCommandInput): DeleteCommand => {
	return new DeleteCommand(input)
}

// Get result for API Gateway
const getResult = (statusCode: number) => {
	let message
	if (statusCode === 200)
		message = 'Delete succeeded'
	else
		message = 'Delete failed'
	return {
		body: JSON.stringify({
			message
		}, null, 2),
		statusCode,
	}
}

// Handler for DELETE /{Id}
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