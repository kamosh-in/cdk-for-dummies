// AWS CDK Library
import { App, Stack, StackProps } from 'aws-cdk-lib'

// Local imports
import { Database } from './database'

export class CdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)
		
		// Initialize Constructs that build the Application
		new Database(this, 'Database')
  }
}
