// AWS CDK Modules
import { App, Stack, StackProps } from 'aws-cdk-lib'

// Local Modules
import { Database } from './database'
import { Api } from './api'

// Stack for the App
export class DummyStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)
		
		// Initialize Constructs that build the Application
		const { table } = new Database(this, 'Database')
		
		new Api(this, 'Api', {
			table,
		})
  }
}
