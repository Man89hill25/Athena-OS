/**
 * ==========================================================================================================
 * ATHENA X - CLOUD & SYNCHRONIZATION ENGINE
 * Module: Base Cloud Storage Provider Abstract Interface
 * 
 * Directive: DIRECTIVE 219 — ATHENA X CLOUD & SYNCHRONIZATION ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { CloudProviderType, CloudStorageMetadata } from './cloud-types';

export interface ICloudStorageProvider {
  readonly providerType: CloudProviderType;
  uploadFile(path: string, content: string | Buffer): Promise<Result<CloudStorageMetadata, Error>>;
  downloadFile(path: string): Promise<Result<string, Error>>;
  deleteFile(path: string): Promise<Result<boolean, Error>>;
  listFiles(directoryPath: string): Promise<Result<CloudStorageMetadata[], Error>>;
}
