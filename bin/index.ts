// AWS CDK Packages
import { App } from 'aws-cdk-lib'

// Local Packages
import { CdkStack } from '../lib'

// Initialize the CDK App
const app = new App()

// Add the Stack to the App
new CdkStack(app, 'CdkStack', {
	// If the Stack needs to reference existing resources, add this env property to use the account and region from the current session
	// env: {
  //   account: process.env.CDK_DEFAULT_ACCOUNT,
  //   region: process.env.CDK_DEFAULT_REGION
  // },
})