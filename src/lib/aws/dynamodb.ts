// AWS SDK Modules
import { DynamoDBClient } from '@aws-sdk/client-dynamodb'
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb'

// Initialize DynamoDB Client
const client = new DynamoDBClient({})

// Export DynamoDB Document Client for reference by handlers
export const ddbDocClient = DynamoDBDocumentClient.from(client)