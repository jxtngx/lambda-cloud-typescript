/**
 * Base response structure for successful API responses
 */
export interface ApiResponse<T> {
  data: T;
}

/**
 * Error response structure
 */
export interface ApiErrorResponse {
  error: ApiError;
}

/**
 * API error details
 */
export interface ApiError {
  code: string;
  message: string;
  suggestion?: string;
}

/**
 * Empty response data
 */
export interface EmptyResponse {}

/**
 * Region information
 */
export interface Region {
  name: PublicRegionCode;
  description: string;
}

/**
 * Available region codes
 */
export enum PublicRegionCode {
  EUROPE_CENTRAL_1 = 'europe-central-1',
  ASIA_SOUTH_1 = 'asia-south-1',
  AUSTRALIA_EAST_1 = 'australia-east-1',
  ME_WEST_1 = 'me-west-1',
  ASIA_NORTHEAST_1 = 'asia-northeast-1',
  ASIA_NORTHEAST_2 = 'asia-northeast-2',
  US_EAST_1 = 'us-east-1',
  US_WEST_2 = 'us-west-2',
  US_WEST_1 = 'us-west-1',
  US_SOUTH_1 = 'us-south-1',
  US_WEST_3 = 'us-west-3',
  US_MIDWEST_1 = 'us-midwest-1',
  US_EAST_2 = 'us-east-2',
  US_SOUTH_2 = 'us-south-2',
  US_SOUTH_3 = 'us-south-3',
  US_EAST_3 = 'us-east-3',
  US_MIDWEST_2 = 'us-midwest-2',
  TEST_EAST_1 = 'test-east-1',
  TEST_WEST_1 = 'test-west-1'
}

/**
 * User account status
 */
export enum UserStatus {
  ACTIVE = 'active',
  DEACTIVATED = 'deactivated'
}

/**
 * User information
 */
export interface User {
  id: string;
  email: string;
  status: UserStatus;
}
