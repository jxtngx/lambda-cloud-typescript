# SSH Keys API

Methods for managing SSH keys for access to Lambda Cloud instances.

## List SSH Keys

Retrieves a list of your SSH keys.

```typescript
async listSSHKeys(): Promise<SSHKey[]>
```

**Example:**

```typescript
const sshKeys = await client.listSSHKeys();
console.log(`You have ${sshKeys.length} SSH keys`);
sshKeys.forEach(key => {
  console.log(`- ${key.name} (${key.id})`);
});
```

## Add SSH Key

Adds an SSH key to your Lambda Cloud account. You can either provide your own public key or have Lambda generate a key pair for you.

```typescript
async addSSHKey(data: AddSSHKeyRequest): Promise<SSHKey | GeneratedSSHKey>
```

**Parameters:**

- `data` (AddSSHKeyRequest): Information about the SSH key to add

**Example with your own public key:**

```typescript
const key = await client.addSSHKey({
  name: 'my-macbook-key',
  public_key: 'ssh-ed25519 AAAAC3NzaC1lZDI1NTE5AAAAICN+lJwsONkwrdsSnQsu1ydUkIuIg5oOC+Eslvmtt60T user@hostname'
});

console.log(`Added key: ${key.name} (${key.id})`);
```

**Example generating a new key pair:**

```typescript
const key = await client.addSSHKey({
  name: 'generated-key'
}) as GeneratedSSHKey;

console.log(`Added key: ${key.name} (${key.id})`);
console.log('Make sure to save the private key:');
console.log(key.private_key);

// Save to file
const fs = require('fs');
fs.writeFileSync('generated-key.pem', key.private_key);
fs.chmodSync('generated-key.pem', 0o400); // Set file to read-only permission
```

## Delete SSH Key

Deletes an SSH key.

```typescript
async deleteSSHKey(id: string): Promise<EmptyResponse>
```

**Parameters:**

- `id` (string): The unique identifier of the SSH key to delete

**Example:**

```typescript
await client.deleteSSHKey('ddf9a910ceb744a0bb95242cbba6cb50');
console.log('SSH key deleted successfully');
```
