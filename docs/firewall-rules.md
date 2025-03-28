# Firewall Rules API

Methods for managing inbound firewall rules for Lambda Cloud instances.

## List Firewall Rules

Retrieves a list of your current firewall rules.

```typescript
async listFirewallRules(): Promise<FirewallRule[]>
```

**Example:**

```typescript
const rules = await client.listFirewallRules();
console.log(`You have ${rules.length} firewall rules:`);
rules.forEach(rule => {
  console.log(`- ${rule.description}`);
  console.log(`  Protocol: ${rule.protocol}`);
  if (rule.port_range) {
    console.log(`  Ports: ${rule.port_range[0]}-${rule.port_range[1]}`);
  }
  console.log(`  Source: ${rule.source_network}`);
});
```

## Set Firewall Rules

Overwrites your current firewall rules with a new set of rules.

```typescript
async setFirewallRules(data: FirewallRulesPutRequest): Promise<FirewallRule[]>
```

**Parameters:**

- `data` (FirewallRulesPutRequest): The new set of firewall rules

**Example:**

```typescript
import { SecurityGroupRuleProtocol } from 'lambda-cloud-typescript';

const newRules = await client.setFirewallRules({
  data: [
    {
      protocol: SecurityGroupRuleProtocol.TCP,
      port_range: [22, 22],
      source_network: '0.0.0.0/0',
      description: 'Allow SSH from anywhere'
    },
    {
      protocol: SecurityGroupRuleProtocol.TCP,
      port_range: [80, 80],
      source_network: '0.0.0.0/0',
      description: 'Allow HTTP from anywhere'
    },
    {
      protocol: SecurityGroupRuleProtocol.TCP,
      port_range: [443, 443],
      source_network: '0.0.0.0/0',
      description: 'Allow HTTPS from anywhere'
    },
    {
      protocol: SecurityGroupRuleProtocol.TCP,
      port_range: [8888, 8888],
      source_network: '0.0.0.0/0',
      description: 'Allow Jupyter access from office network'
    }
  ]
});

console.log(`Updated firewall with ${newRules.length} rules`);
```

## Firewall Rule Protocols

The Lambda Cloud API supports the following protocols for firewall rules:

```typescript
enum SecurityGroupRuleProtocol {
  TCP = 'tcp',
  UDP = 'udp',
  ICMP = 'icmp',
  ALL = 'all'
}
```

## Important Notes

1. The `port_range` field is required for TCP, UDP, and ALL protocols, but not allowed for ICMP
2. Source networks must be specified in CIDR notation
3. Use '0.0.0.0/0' to allow traffic from any source
4. Firewall rules do not apply in the 'us-south-1' region
5. The `setFirewallRules` method replaces ALL existing rules, so make sure to include all rules you want to keep
