// Declare the following environment variables to be defined
declare global {
  namespace NodeJS {
    interface ProcessEnv {
			
			// Name of Authorization Token
			SECRET_NAME: string,

			// Name of DynamoDB Table
      TABLE_NAME: string,
    }
  }
}

// Export environment variables for reference by handlers
export const { SECRET_NAME, TABLE_NAME } = process.env