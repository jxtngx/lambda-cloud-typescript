/**
 * Authentication options for the Lambda Cloud API
 */
export interface AuthOptions {
  /**
   * API key for authentication
   */
  apiKey: string;
}

/**
 * Authentication header creation methods
 */
export enum AuthMethod {
  /**
   * Bearer token authentication (recommended)
   * Authorization: Bearer <apiKey>
   */
  BEARER = 'bearer',
  
  /**
   * Basic authentication
   * Authorization: Basic <base64 of apiKey:>
   */
  BASIC = 'basic'
}
