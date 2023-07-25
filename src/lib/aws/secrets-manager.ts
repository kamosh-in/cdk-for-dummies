// AWS SDK Modules
import { SecretsManagerClient } from '@aws-sdk/client-secrets-manager'

// Export Secrets Manager Client for reference by handlers
export const secretsManagerClient = new SecretsManagerClient({});
