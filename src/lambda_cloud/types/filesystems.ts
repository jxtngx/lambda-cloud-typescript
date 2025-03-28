import { PublicRegionCode, Region, User } from './common';

/**
 * Filesystem details
 */
export interface Filesystem {
  id: string;
  name: string;
  mount_point: string;
  created: string;
  created_by: User;
  is_in_use: boolean;
  region: Region;
  bytes_used?: number;
}

/**
 * Request to create a filesystem
 */
export interface FilesystemCreateRequest {
  name: string;
  region: PublicRegionCode;
}

/**
 * Response from deleting a filesystem
 */
export interface FilesystemDeleteResponse {
  deleted_ids: string[];
}
