// AWS Lambda Type Modules
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// AWS SDK Modules
import { } from '@aws-sdk/lib-dynamodb'

// Local Modules
import { } from '../lib/aws'
import { } from  '../lib/env'

const getInput = () => {

}

const getCommand = () => {

}

const getResult = () => {

}

export const handler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
	console.log(`EVENT:\n${JSON.stringify(event, null, 2)}`)
	return {
		statusCode: 200,
		body: JSON.stringify({
			message: 'Hello World!'
		})
	}
}