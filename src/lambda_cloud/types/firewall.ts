/**
 * Network protocols for firewall rules
 */
export enum SecurityGroupRuleProtocol {
  TCP = 'tcp',
  UDP = 'udp',
  ICMP = 'icmp',
  ALL = 'all'
}

/**
 * Firewall rule definition
 */
export interface FirewallRule {
  protocol: SecurityGroupRuleProtocol;
  port_range?: [number, number]; // Required for TCP, UDP, ALL protocols
  source_network: string; // IP CIDR notation
  description: string;
}

/**
 * Request to update firewall rules
 */
export interface FirewallRulesPutRequest {
  data: FirewallRule[];
}
