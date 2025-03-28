# Filesystems API

Methods for managing persistent filesystems that can be attached to Lambda Cloud instances.

## List Filesystems

Retrieves a list of your filesystems.

```typescript
async listFilesystems(): Promise<Filesystem[]>
```

**Example:**

```typescript
const filesystems = await client.listFilesystems();
console.log(`You have ${filesystems.length} filesystems:`);
filesystems.forEach(fs => {
  console.log(`- ${fs.name} (${fs.id})`);
  console.log(`  Region: ${fs.region.description}`);
  console.log(`  Mount point: ${fs.mount_point}`);
  console.log(`  In use: ${fs.is_in_use ? 'Yes' : 'No'}`);
  if (fs.bytes_used !== undefined) {
    console.log(`  Used space: ${(fs.bytes_used / 1024 / 1024 / 1024).toFixed(2)} GB`);
  }
});
```

## Create Filesystem

Creates a new filesystem.

```typescript
async createFilesystem(data: FilesystemCreateRequest): Promise<Filesystem>
```

**Parameters:**

- `data` (FilesystemCreateRequest): Information about the filesystem to create

**Example:**

```typescript
const newFs = await client.createFilesystem({
  name: 'my-data',
  region: PublicRegionCode.US_WEST_1
});

console.log(`Created filesystem: ${newFs.name} (${newFs.id})`);
console.log(`Mount point: ${newFs.mount_point}`);
```

## Delete Filesystem

Deletes a filesystem. The filesystem must not be attached to any running instances.

```typescript
async deleteFilesystem(id: string): Promise<FilesystemDeleteResponse>
```

**Parameters:**

- `id` (string): The unique identifier of the filesystem to delete

**Example:**

```typescript
try {
  const result = await client.deleteFilesystem('FILESYSTEM_ID');
  console.log(`Deleted filesystem(s) with IDs: ${result.deleted_ids.join(', ')}`);
} catch (error) {
  console.error('Failed to delete filesystem:', error.message);
  // Handle potential error if the filesystem is in use
}
```

## Attaching Filesystems to Instances

Filesystems are attached to instances during instance launch using the `file_system_names` parameter:

```typescript
const launchResponse = await client.launchInstance({
  region_name: PublicRegionCode.US_WEST_1,
  instance_type_name: 'gpu_1x_a10',
  ssh_key_names: ['my-ssh-key'],
  name: 'Instance with Filesystem',
  file_system_names: ['my-data']
});
```

**Important Notes:**
1. Filesystems can only be attached to instances in the same region
2. Currently only one filesystem can be attached to an instance
3. Filesystems that are in use (attached to instances) cannot be deleted
