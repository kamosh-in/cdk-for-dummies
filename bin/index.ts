// AWS CDK Library
import { App } from 'aws-cdk-lib'

// Local imports
import { CdkStack } from '../lib'

// Initialize the CDK App
const app = new App()

// Add the Stack to the App
new CdkStack(app, 'CdkStack')