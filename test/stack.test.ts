// AWS CDK Modules
import { App } from 'aws-cdk-lib'

// CDK Assertion Testing
import { Template } from 'aws-cdk-lib/assertions'

// Local Modules
import { DummyStack } from '../lib'

const app = new App()
const stack = new DummyStack(app, 'DummyStack')
const template = Template.fromStack(stack)

test('DynamoDB Table Created', () => {
  template.hasResourceProperties('AWS::DynamoDB::Table', {
		AttributeDefinitions: [
		 {
			AttributeName: 'Id',
			AttributeType: 'S'
		 }
		],
		BillingMode: 'PAY_PER_REQUEST',
		KeySchema: [
			{
			 AttributeName: 'Id',
			 KeyType: 'HASH'
			}
		 ],
  })
})

test('DynamoDB Table Production-ready', () => {
  template.hasResource('AWS::DynamoDB::Table', {
		DeletionPolicy: 'Retain',
		UpdateReplacePolicy: 'Retain',
  })
})

test('API Gateway Created', () => {
  template.hasResource('AWS::ApiGateway::RestApi',{
	})
})

test('API Gateway Production-ready', () => {
	template.hasResourceProperties('AWS::ApiGateway::Stage', {
		StageName: 'prod',
	})
})