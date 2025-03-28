# API Error Handling

This document covers the common error types returned by the Lambda Cloud API and how to handle them in your code.

## Error Structure

When an API request fails, the client throws a JavaScript Error with a message containing:

1. The error code (e.g., `global/invalid-api-key`)
2. The error message
3. A suggestion for how to address the error (if provided by the API)

## Common Error Codes

### Authentication and Authorization Errors

| Error Code | Description | Suggestion |
|------------|-------------|------------|
| `global/invalid-api-key` | API key is invalid, expired, or deleted | Check your API key or create a new one |
| `global/account-inactive` | Your account is inactive | Verify your email and add a valid payment method |

### Resource Errors

| Error Code | Description | Suggestion |
|------------|-------------|------------|
| `global/object-does-not-exist` | The specified resource does not exist | Check the resource ID |
| `global/invalid-parameters` | Invalid request data | Check request parameters |
| `global/quota-exceeded` | Account quota exceeded | Contact Lambda support |
| `global/duplicate` | A resource with this name already exists | Use a different name |

### Instance-Specific Errors

| Error Code | Description | Suggestion |
|------------|-------------|------------|
| `instance-operations/launch/insufficient-capacity` | Not enough capacity to fulfill request | Try a different region or instance type |
| `instance-operations/launch/file-system-in-wrong-region` | Filesystem is in a different region | Use a filesystem in the same region |

### Filesystem-Specific Errors

| Error Code | Description | Suggestion |
|------------|-------------|------------|
| `filesystems/filesystem-in-use` | The filesystem is attached to an instance | Terminate instances using the filesystem first |

## Error Handling Examples

### Basic Error Handling

```typescript
try {
  const instance = await client.getInstance('non-existent-id');
} catch (error) {
  console.error('Error:', error.message);
  // Log: Error: global/object-does-not-exist: Specified instance does not exist.
}
```

### Checking for Specific Error Types

```typescript
try {
  const response = await client.launchInstance({
    region_name: PublicRegionCode.US_WEST_1,
    instance_type_name: 'gpu_1x_a10',
    ssh_key_names: ['non-existent-key']
  });
} catch (error) {
  if (error.message.includes('global/object-does-not-exist')) {
    console.error('SSH key not found. Available keys:');
    const keys = await client.listSSHKeys();
    keys.forEach(key => console.log(`- ${key.name}`));
  } else {
    console.error('Launch failed:', error.message);
  }
}
```

### Handling Capacity Errors

```typescript
async function launchWithFailover(instanceType, preferredRegions) {
  for (const region of preferredRegions) {
    try {
      const response = await client.launchInstance({
        region_name: region,
        instance_type_name: instanceType,
        ssh_key_names: ['my-key']
      });
      console.log(`Launched in ${region}!`);
      return response;
    } catch (error) {
      if (error.message.includes('insufficient-capacity')) {
        console.log(`No capacity in ${region}, trying next region...`);
        continue;
      }
      // Re-throw other errors
      throw error;
    }
  }
  throw new Error('No capacity available in any of the preferred regions');
}

// Usage
try {
  const response = await launchWithFailover(
    'gpu_1x_a10', 
    [
      PublicRegionCode.US_WEST_1, 
      PublicRegionCode.US_EAST_1, 
      PublicRegionCode.EUROPE_CENTRAL_1
    ]
  );
} catch (error) {
  console.error('Failed to launch:', error.message);
}
```

## Provider Errors

The Lambda Cloud API may return errors with the prefix `provider/` which come from upstream services. Common provider errors include:

| Error Code | Description | Suggestion |
|------------|-------------|------------|
| `provider/internal-unavailable` | Provider unavailable | Try again shortly |
| `provider/quota-exceeded` | Provider quota exceeded | Contact Lambda support |

These errors are typically transient. For provider errors, implementing a retry strategy with exponential backoff is recommended:

```typescript
async function withRetry(fn, maxRetries = 3, initialDelay = 1000) {
  let lastError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      
      if (error.message.includes('provider/')) {
        const delay = initialDelay * Math.pow(2, attempt - 1);
        console.log(`Provider error, retrying in ${delay}ms (attempt ${attempt}/${maxRetries})`);
        await new Promise(resolve => setTimeout(resolve, delay));
        continue;
      }
      
      // Non-provider error, don't retry
      throw error;
    }
  }
  
  throw lastError;
}

// Usage
try {
  const instances = await withRetry(() => client.listInstances());
  console.log(`Found ${instances.length} instances`);
} catch (error) {
  console.error('Operation failed after retries:', error.message);
}
```
