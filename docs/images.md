# Images API

Methods for managing machine images that can be used to launch Lambda Cloud instances.

## List Images

Retrieves a list of available machine images by region.

```typescript
async listImages(): Promise<Image[]>
```

**Example:**

```typescript
const images = await client.listImages();
console.log(`Found ${images.length} available images:`);

// Group images by family
const imagesByFamily = images.reduce((acc, img) => {
  if (!acc[img.family]) {
    acc[img.family] = [];
  }
  acc[img.family].push(img);
  return acc;
}, {} as Record<string, Image[]>);

// Display available image families
for (const [family, images] of Object.entries(imagesByFamily)) {
  console.log(`Family: ${family}`);
  images.forEach(img => {
    console.log(`- ${img.name} (${img.architecture})`);
    console.log(`  Region: ${img.region.description}`);
    console.log(`  Description: ${img.description}`);
  });
}
```

## Using Images with Instance Launch

When launching an instance, you can specify the image to use in two ways:

### 1. By Image ID

```typescript
const launchResponse = await client.launchInstance({
  region_name: PublicRegionCode.US_WEST_1,
  instance_type_name: 'gpu_1x_a10',
  ssh_key_names: ['my-ssh-key'],
  image: {
    id: '43336648-096d-4cba-9aa2-f9bb7727639d'
  }
});
```

### 2. By Image Family

```typescript
const launchResponse = await client.launchInstance({
  region_name: PublicRegionCode.US_WEST_1,
  instance_type_name: 'gpu_1x_a10',
  ssh_key_names: ['my-ssh-key'],
  image: {
    family: 'ubuntu-lts'
  }
});
```

When specifying a family, Lambda Cloud will use the latest version of that image family in the specified region.

## Image Architecture Types

The Lambda Cloud API supports the following image architecture types:

```typescript
enum ImageArchitecture {
  X86_64 = 'x86_64',
  ARM64 = 'arm64'
}
```

Make sure to choose an image with an architecture that's compatible with your selected instance type.
