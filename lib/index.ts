import { App, Stack, StackProps } from 'aws-cdk-lib'

export class CdkStack extends Stack {
  constructor(scope: App, id: string, props?: StackProps) {
    super(scope, id, props)
		
  }
}
