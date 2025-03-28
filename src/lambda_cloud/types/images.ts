import { Region } from './common';

/**
 * CPU architectures supported by images
 */
export enum ImageArchitecture {
  X86_64 = 'x86_64',
  ARM64 = 'arm64'
}

/**
 * Image details
 */
export interface Image {
  id: string;
  created_time: string;
  updated_time: string;
  name: string;
  description: string;
  family: string;
  version: string;
  architecture: ImageArchitecture;
  region: Region;
}
