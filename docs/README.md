# Lambda Cloud TypeScript Client Documentation

This TypeScript client provides a convenient way to interact with the Lambda Cloud API. It handles authentication, request formatting, and error handling while providing strongly-typed interfaces for all API operations.

## Table of Contents
- [Installation](#installation)
- [Getting Started](#getting-started)
- [Client Configuration](#client-configuration)
- [API Reference](#api-reference)
- [Error Handling](#error-handling)
- [Examples](#examples)

## Installation

```bash
# install directly from GitHub
pnpm add github:jxtngx/lambda-cloud-typescript
```

## Getting Started

Import the client and necessary types:

```typescript
import { LambdaCloudClient, PublicRegionCode } from 'lambda-cloud-typescript';

// Create a client instance
const client = new LambdaCloudClient({
  apiKey: 'your-api-key-here'
});

// Example: List running instances
async function listInstances() {
  try {
    const instances = await client.listInstances();
    console.log(instances);
  } catch (error) {
    console.error('Failed to list instances:', error);
  }
}

listInstances();
```

## Client Configuration

The `LambdaCloudClient` constructor accepts the following parameters:

```typescript
new LambdaCloudClient(
  options: AuthOptions,
  baseUrl?: string,
  authMethod?: AuthMethod
)
```

| Parameter | Type | Description | Default |
|-----------|------|-------------|---------|
| options | AuthOptions | Object containing the API key | Required |
| baseUrl | string | Base URL of the Lambda Cloud API | 'https://cloud.lambdalabs.com' |
| authMethod | AuthMethod | Authentication method (BEARER or BASIC) | AuthMethod.BEARER |

### Authentication

The client supports two authentication methods:

1. **Bearer Authentication** (default): Uses the `Authorization: Bearer <API_KEY>` header
2. **Basic Authentication**: Uses the `Authorization: Basic <BASE64_ENCODED_API_KEY_WITH_COLON>` header

## API Reference

See detailed documentation for specific API endpoints:
- [Instances](./instances.md)
- [SSH Keys](./ssh-keys.md)
- [Filesystems](./filesystems.md)
- [Images](./images.md)
- [Firewall Rules](./firewall-rules.md)

## Error Handling

The client handles API errors by throwing JavaScript Error objects with formatted messages. Each error message includes:

- Error code
- Error message
- Suggestion (if provided by the API)

Example error handling:

```typescript
try {
  await client.launchInstance({
    region_name: PublicRegionCode.US_WEST_1,
    instance_type_name: 'gpu_1x_a10',
    ssh_key_names: ['my-ssh-key']
  });
} catch (error) {
  console.error('Launch failed:', error.message);
}
```

## Examples

See the [examples directory](./examples/) for more detailed usage examples.
