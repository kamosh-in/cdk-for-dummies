import { APIGatewayProxyHandler } from 'aws-lambda'

export const handler: APIGatewayProxyHandler = async (event) => {
    console.log(`EVENT: \n ${
			JSON.stringify(event, null, 2)
		}`)
		return {
			statusCode: 200,
			body: JSON.stringify({
				message: 'Hello World!'
			})
		}
};