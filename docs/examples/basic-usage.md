# Basic Usage Examples

This document shows basic examples for common operations using the Lambda Cloud TypeScript client.

## Client Initialization

```typescript
import { LambdaCloudClient, AuthMethod } from 'lambda-cloud-typescript';

// Basic initialization with API key
const client = new LambdaCloudClient({
  apiKey: 'your-api-key-here'
});

// Optional: Use Basic authentication instead of Bearer
const clientWithBasicAuth = new LambdaCloudClient(
  { apiKey: 'your-api-key-here' },
  'https://cloud.lambdalabs.com',
  AuthMethod.BASIC
);
```

## Working with Instances

### List Available Instance Types

```typescript
async function showAvailableInstanceTypes() {
  const instanceTypes = await client.listInstanceTypes();
  
  console.log('Available instance types:');
  for (const [name, info] of Object.entries(instanceTypes)) {
    if (info.regions_with_capacity_available.length > 0) {
      console.log(`- ${name}: ${info.instance_type.description}`);
      console.log(`  Price: $${(info.instance_type.price_cents_per_hour / 100).toFixed(2)}/hr`);
      console.log(`  Available in: ${info.regions_with_capacity_available
        .map(r => r.description).join(', ')}`);
    }
  }
}
```

### Launch a New Instance

```typescript
import { PublicRegionCode } from 'lambda-cloud-typescript';

async function launchNewInstance() {
  // First, ensure we have an SSH key
  const sshKeys = await client.listSSHKeys();
  if (sshKeys.length === 0) {
    console.log('No SSH keys found. Creating one...');
    const newKey = await client.addSSHKey({ name: 'my-api-key' });
    console.log('Created new SSH key:', newKey.name);
    
    if ('private_key' in newKey) {
      console.log('Make sure to save the private key:');
      console.log(newKey.private_key);
      
      // Save to file
      const fs = require('fs');
      fs.writeFileSync('lambda-key.pem', newKey.private_key);
      fs.chmodSync('lambda-key.pem', 0o400);
    }
  }
  
  const keyName = sshKeys.length > 0 ? sshKeys[0].name : 'my-api-key';
  
  // Launch the instance
  const response = await client.launchInstance({
    region_name: PublicRegionCode.US_WEST_1,
    instance_type_name: 'gpu_1x_a10',
    ssh_key_names: [keyName],
    name: 'Test Instance',
    // Optional: attach a filesystem
    // file_system_names: ['my-data']
  });
  
  console.log(`Launched instance(s) with IDs: ${response.instance_ids.join(', ')}`);
  
  // Wait for instance to be ready
  const instanceId = response.instance_ids[0];
  let instance;
  
  do {
    console.log('Waiting for instance to become active...');
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    
    instance = await client.getInstance(instanceId);
    console.log(`Instance status: ${instance.status}`);
  } while (instance.status === 'booting');
  
  if (instance.status === 'active') {
    console.log(`\nInstance is ready!`);
    console.log(`IP address: ${instance.ip}`);
    console.log(`SSH command: ssh -i lambda-key.pem ubuntu@${instance.ip}`);
    
    if (instance.jupyter_url) {
      console.log(`Jupyter URL: ${instance.jupyter_url}`);
    }
  }
}
```

## Working with SSH Keys

### List and Add SSH Keys

```typescript
import { readFileSync } from 'fs';

async function manageSSHKeys() {
  // List existing keys
  const keys = await client.listSSHKeys();
  console.log(`You have ${keys.length} SSH keys`);
  
  // Add a key from a file
  try {
    const publicKeyContent = readFileSync('/path/to/your/key.pub', 'utf8').trim();
    const newKey = await client.addSSHKey({
      name: 'my-local-key',
      public_key: publicKeyContent
    });
    console.log(`Added new key: ${newKey.name} (${newKey.id})`);
  } catch (error) {
    console.error('Failed to add key:', error);
  }
}
```

## Working with Filesystems

### Create and Manage Filesystems

```typescript
import { PublicRegionCode } from 'lambda-cloud-typescript';

async function manageFilesystems() {
  // List existing filesystems
  const filesystems = await client.listFilesystems();
  console.log(`You have ${filesystems.length} filesystems`);
  
  // Create a new filesystem
  try {
    const newFs = await client.createFilesystem({
      name: 'project-data',
      region: PublicRegionCode.US_WEST_1
    });
    console.log(`Created filesystem: ${newFs.name} (${newFs.id})`);
    console.log(`Mount point: ${newFs.mount_point}`);
  } catch (error) {
    console.error('Failed to create filesystem:', error);
  }
}
```

## Error Handling

```typescript
async function errorHandlingExample() {
  try {
    // Try to launch an instance in a region with insufficient capacity
    await client.launchInstance({
      region_name: PublicRegionCode.US_WEST_1,
      instance_type_name: 'gpu_8x_h100',  // Assuming limited availability
      ssh_key_names: ['my-key']
    });
  } catch (error) {
    console.error('Failed to launch instance:');
    console.error(`- Error message: ${error.message}`);
    
    // Check for specific error types
    if (error.message.includes('insufficient-capacity')) {
      console.log('Trying alternative region...');
      // Alternative logic here
    } else if (error.message.includes('quota-exceeded')) {
      console.log('Your account quota has been exceeded.');
    }
  }
}
```
