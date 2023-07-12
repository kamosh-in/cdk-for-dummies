import { Stack } from 'aws-cdk-lib'
import { Construct } from 'constructs'

export interface DatabaseProps {
	// Include any necessary properties to build the Database
}

export class Database extends Construct {
  constructor(scope: Stack, id: string, props?: DatabaseProps) {
    super(scope, id)

  }
}