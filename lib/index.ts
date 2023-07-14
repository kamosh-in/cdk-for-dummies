// AWS CDK Packages
import { App, Stack, StackProps } from 'aws-cdk-lib'

// Local Packages
import { Database } from './database'
import { Api } from './api'

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
