/**
 * SSH Key details
 */
export interface SSHKey {
  id: string;
  name: string;
  public_key: string;
}

/**
 * Generated SSH Key contains the same fields as SSHKey plus the private key
 */
export interface GeneratedSSHKey extends SSHKey {
  private_key: string;
}

/**
 * Request to add a new SSH key
 */
export interface AddSSHKeyRequest {
  name: string;
  public_key?: string;
}
