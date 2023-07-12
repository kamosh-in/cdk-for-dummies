// AWS CDK Libraries
import { Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb'

export interface DatabaseProps {
	// Include any necessary properties to build the Database
}

export class Database extends Construct {

	// Accessible properties by the parent
	table: Table

  constructor(scope: Stack, id: string, props?: DatabaseProps) {
    super(scope, id)

		// DynamoDB Table to hold items for the Application
		this.table = new Table(this, 'Table', {

			// AWS-Managed read-write provisioning
			billingMode: BillingMode.PAY_PER_REQUEST,

			// Primary key properties
			partitionKey: {
				name: 'Id',
				type: AttributeType.STRING,
			},
		})
  }
}