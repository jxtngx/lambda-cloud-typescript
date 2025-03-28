# Instances API

Methods for managing Lambda Cloud instances.

## List Instances

Retrieves a list of your running instances.

```typescript
async listInstances(): Promise<Instance[]>
```

**Example:**

```typescript
const instances = await client.listInstances();
console.log(`You have ${instances.length} running instances`);
```

## Get Instance Details

Retrieves the details of a specific instance.

```typescript
async getInstance(id: string): Promise<Instance>
```

**Parameters:**

- `id` (string): The unique identifier of the instance

**Example:**

```typescript
const instance = await client.getInstance('INSTANCE_ID');
console.log(`Instance ${instance.name || instance.id} is ${instance.status}`);
```

## Update Instance

Updates the details of a specific instance.

```typescript
async updateInstance(id: string, data: InstanceModificationRequest): Promise<Instance>
```

**Parameters:**

- `id` (string): The unique identifier of the instance
- `data` (InstanceModificationRequest): The updated instance properties

**Example:**

```typescript
const updatedInstance = await client.updateInstance('INSTANCE_ID', {
  name: 'My Renamed Instance'
});
console.log(`Instance renamed to: ${updatedInstance.name}`);
```

## List Instance Types

Retrieves a list of the available instance types and their regional availability.

```typescript
async listInstanceTypes(): Promise<InstanceTypes>
```

**Example:**

```typescript
const instanceTypes = await client.listInstanceTypes();

// Display all instance types with A100 GPUs
for (const [name, details] of Object.entries(instanceTypes)) {
  if (details.instance_type.gpu_description.includes('A100')) {
    console.log(`${name}: ${details.instance_type.description}`);
    console.log(`  Available in: ${details.regions_with_capacity_available
      .map(r => r.description).join(', ')}`);
  }
}
```

## Launch Instance

Launches a new Lambda Cloud instance.

```typescript
async launchInstance(data: InstanceLaunchRequest): Promise<InstanceLaunchResponse>
```

**Parameters:**

- `data` (InstanceLaunchRequest): Configuration for the new instance

**Example:**

```typescript
const launchResponse = await client.launchInstance({
  region_name: PublicRegionCode.US_WEST_1,
  instance_type_name: 'gpu_1x_a10',
  ssh_key_names: ['my-ssh-key'],
  name: 'My New Instance'
});

console.log(`Launched instance(s) with IDs: ${launchResponse.instance_ids.join(', ')}`);
```

## Restart Instance

Restarts one or more instances.

```typescript
async restartInstance(data: InstanceRestartRequest): Promise<InstanceRestartResponse>
```

**Parameters:**

- `data` (InstanceRestartRequest): Contains the IDs of instances to restart

**Example:**

```typescript
const restartResponse = await client.restartInstance({
  instance_ids: ['INSTANCE_ID']
});

console.log(`Restarted ${restartResponse.restarted_instances.length} instances`);
```

## Terminate Instance

Terminates one or more instances.

```typescript
async terminateInstance(data: InstanceTerminateRequest): Promise<InstanceTerminateResponse>
```

**Parameters:**

- `data` (InstanceTerminateRequest): Contains the IDs of instances to terminate

**Example:**

```typescript
const terminateResponse = await client.terminateInstance({
  instance_ids: ['INSTANCE_ID']
});

console.log(`Terminated ${terminateResponse.terminated_instances.length} instances`);
```
