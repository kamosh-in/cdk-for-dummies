import { DynamoDBClient } from '@aws-sdk/client-dynamodb'

const client = new DynamoDBClient({})

import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

export const ddbDocClient = DynamoDBDocumentClient.from(client)