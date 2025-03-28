import { PublicRegionCode, Region } from './common';

/**
 * Current status of an instance
 */
export enum InstanceStatus {
  BOOTING = 'booting',
  ACTIVE = 'active',
  UNHEALTHY = 'unhealthy',
  TERMINATED = 'terminated',
  TERMINATING = 'terminating'
}

/**
 * Reason code for why an instance action is unavailable
 */
export enum InstanceActionUnavailableCode {
  VM_HAS_NOT_LAUNCHED = 'vm-has-not-launched',
  VM_IS_TOO_OLD = 'vm-is-too-old',
  VM_IS_TERMINATING = 'vm-is-terminating'
}

/**
 * Specifications of an instance type
 */
export interface InstanceTypeSpecs {
  vcpus: number;
  memory_gib: number;
  storage_gib: number;
  gpus: number;
}

/**
 * Details of an instance type
 */
export interface InstanceType {
  name: string;
  description: string;
  gpu_description: string;
  price_cents_per_hour: number;
  specs: InstanceTypeSpecs;
}

/**
 * Availability status of an instance action
 */
export interface InstanceActionAvailabilityDetails {
  available: boolean;
  reason_code?: InstanceActionUnavailableCode | string;
  reason_description?: string;
}

/**
 * Collection of action availability statuses for an instance
 */
export interface InstanceActionAvailability {
  migrate: InstanceActionAvailabilityDetails;
  rebuild: InstanceActionAvailabilityDetails;
  restart: InstanceActionAvailabilityDetails;
  cold_reboot: InstanceActionAvailabilityDetails;
  terminate: InstanceActionAvailabilityDetails;
}

/**
 * Instance details
 */
export interface Instance {
  id: string;
  name?: string;
  ip: string;
  private_ip: string;
  status: InstanceStatus;
  ssh_key_names: string[];
  file_system_names: string[];
  region: Region;
  instance_type: InstanceType;
  hostname?: string;
  jupyter_token?: string;
  jupyter_url?: string;
  is_reserved?: boolean;
  actions: InstanceActionAvailability;
}

/**
 * Regional availability information for an instance type
 */
export interface InstanceTypesItem {
  instance_type: InstanceType;
  regions_with_capacity_available: Region[];
}

/**
 * Available instance types by name
 */
export interface InstanceTypes {
  [instanceTypeName: string]: InstanceTypesItem;
}

/**
 * Image specification using ID
 */
export interface ImageSpecificationID {
  id: string;
}

/**
 * Image specification using family
 */
export interface ImageSpecificationFamily {
  family: string;
}

/**
 * Request to launch an instance
 */
export interface InstanceLaunchRequest {
  region_name: PublicRegionCode;
  instance_type_name: string;
  ssh_key_names: string[];
  file_system_names?: string[];
  name?: string;
  image?: ImageSpecificationID | ImageSpecificationFamily;
  user_data?: string;
}

/**
 * Response from launching an instance
 */
export interface InstanceLaunchResponse {
  instance_ids: string[];
}

/**
 * Request to restart one or more instances
 */
export interface InstanceRestartRequest {
  instance_ids: string[];
}

/**
 * Response from restarting instances
 */
export interface InstanceRestartResponse {
  restarted_instances: Instance[];
}

/**
 * Request to terminate one or more instances
 */
export interface InstanceTerminateRequest {
  instance_ids: string[];
}

/**
 * Response from terminating instances
 */
export interface InstanceTerminateResponse {
  terminated_instances: Instance[];
}

/**
 * Request to modify an instance
 */
export interface InstanceModificationRequest {
  name?: string;
}
