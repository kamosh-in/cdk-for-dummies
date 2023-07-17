// AWS Lambda Type Packages
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'

// AWS SDK Packages
import { } from '@aws-sdk/client-dynamodb'

// Local Packages
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