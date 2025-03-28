import fetch from 'node-fetch';
import { AuthMethod, AuthOptions } from './types/auth';
import {
  ApiResponse,
  ApiErrorResponse,
  EmptyResponse,
  Instance,
  InstanceTypes,
  InstanceLaunchRequest,
  InstanceLaunchResponse,
  InstanceRestartRequest,
  InstanceRestartResponse,
  InstanceTerminateRequest,
  InstanceTerminateResponse,
  InstanceModificationRequest,
  SSHKey,
  GeneratedSSHKey,
  AddSSHKeyRequest,
  Filesystem,
  FilesystemCreateRequest,
  FilesystemDeleteResponse,
  Image,
  FirewallRule,
  FirewallRulesPutRequest
} from './types';

export class LambdaCloudClient {
  private readonly baseUrl: string;
  private readonly apiKey: string;
  private readonly authMethod: AuthMethod;

  /**
   * Creates a new Lambda Cloud API client
   * 
   * @param options Authentication options
   * @param baseUrl API base URL (defaults to https://cloud.lambdalabs.com)
   * @param authMethod Authentication method to use (defaults to Bearer)
   */
  constructor(
    options: AuthOptions, 
    baseUrl: string = 'https://cloud.lambdalabs.com',
    authMethod: AuthMethod = AuthMethod.BEARER
  ) {
    this.baseUrl = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    this.apiKey = options.apiKey;
    this.authMethod = authMethod;
  }

  /**
   * Creates the appropriate authorization header based on the selected auth method
   */
  private getAuthHeaders(): { [key: string]: string } {
    if (this.authMethod === AuthMethod.BASIC) {
      // For Basic auth, we need to encode the API key with a trailing colon
      const encoded = Buffer.from(`${this.apiKey}:`).toString('base64');
      return { 'Authorization': `Basic ${encoded}` };
    } else {
      // Default to Bearer auth
      return { 'Authorization': `Bearer ${this.apiKey}` };
    }
  }

  /**
   * Makes an API request with error handling
   */
  private async request<T>(
    method: string, 
    path: string, 
    body?: any
  ): Promise<T> {
    const url = `${this.baseUrl}${path}`;
    const headers = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...this.getAuthHeaders()
    };

    const options: any = {
      method,
      headers,
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json() as ApiResponse<T> | ApiErrorResponse;

    if (!response.ok) {
      const errorData = data as ApiErrorResponse;
      throw new Error(`${errorData.error.code}: ${errorData.error.message}${
        errorData.error.suggestion ? ` - ${errorData.error.suggestion}` : ''
      }`);
    }

    return (data as ApiResponse<T>).data;
  }

  /**
   * List running instances
   */
  async listInstances(): Promise<Instance[]> {
    return this.request<Instance[]>('GET', '/api/v1/instances');
  }

  /**
   * Retrieve instance details
   * 
   * @param id Instance ID
   */
  async getInstance(id: string): Promise<Instance> {
    return this.request<Instance>('GET', `/api/v1/instances/${id}`);
  }

  /**
   * Update instance details
   * 
   * @param id Instance ID
   * @param data Modification request data
   */
  async updateInstance(id: string, data: InstanceModificationRequest): Promise<Instance> {
    return this.request<Instance>('POST', `/api/v1/instances/${id}`, data);
  }

  /**
   * List available instance types
   */
  async listInstanceTypes(): Promise<InstanceTypes> {
    return this.request<InstanceTypes>('GET', '/api/v1/instance-types');
  }

  /**
   * Launch instances
   * 
   * @param data Launch request data
   */
  async launchInstance(data: InstanceLaunchRequest): Promise<InstanceLaunchResponse> {
    return this.request<InstanceLaunchResponse>('POST', '/api/v1/instance-operations/launch', data);
  }

  /**
   * Restart instances
   * 
   * @param data Restart request data
   */
  async restartInstance(data: InstanceRestartRequest): Promise<InstanceRestartResponse> {
    return this.request<InstanceRestartResponse>('POST', '/api/v1/instance-operations/restart', data);
  }

  /**
   * Terminate instances
   * 
   * @param data Terminate request data
   */
  async terminateInstance(data: InstanceTerminateRequest): Promise<InstanceTerminateResponse> {
    return this.request<InstanceTerminateResponse>('POST', '/api/v1/instance-operations/terminate', data);
  }

  /**
   * List SSH keys
   */
  async listSSHKeys(): Promise<SSHKey[]> {
    return this.request<SSHKey[]>('GET', '/api/v1/ssh-keys');
  }

  /**
   * Add an SSH key
   * 
   * @param data Key request data
   */
  async addSSHKey(data: AddSSHKeyRequest): Promise<SSHKey | GeneratedSSHKey> {
    return this.request<SSHKey | GeneratedSSHKey>('POST', '/api/v1/ssh-keys', data);
  }

  /**
   * Delete an SSH key
   * 
   * @param id SSH key ID
   */
  async deleteSSHKey(id: string): Promise<EmptyResponse> {
    return this.request<EmptyResponse>('DELETE', `/api/v1/ssh-keys/${id}`);
  }

  /**
   * List filesystems
   */
  async listFilesystems(): Promise<Filesystem[]> {
    return this.request<Filesystem[]>('GET', '/api/v1/file-systems');
  }

  /**
   * Create a filesystem
   * 
   * @param data Filesystem creation data
   */
  async createFilesystem(data: FilesystemCreateRequest): Promise<Filesystem> {
    return this.request<Filesystem>('POST', '/api/v1/filesystems', data);
  }

  /**
   * Delete a filesystem
   * 
   * @param id Filesystem ID
   */
  async deleteFilesystem(id: string): Promise<FilesystemDeleteResponse> {
    return this.request<FilesystemDeleteResponse>('DELETE', `/api/v1/filesystems/${id}`);
  }

  /**
   * List available images
   */
  async listImages(): Promise<Image[]> {
    return this.request<Image[]>('GET', '/api/v1/images');
  }

  /**
   * List inbound firewall rules
   */
  async listFirewallRules(): Promise<FirewallRule[]> {
    return this.request<FirewallRule[]>('GET', '/api/v1/firewall-rules');
  }

  /**
   * Replace inbound firewall rules
   * 
   * @param data Firewall rules data
   */
  async setFirewallRules(data: FirewallRulesPutRequest): Promise<FirewallRule[]> {
    return this.request<FirewallRule[]>('PUT', '/api/v1/firewall-rules', data);
  }
}
