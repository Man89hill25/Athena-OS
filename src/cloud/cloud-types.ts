/**
 * ==========================================================================================================
 * ATHENA X - CLOUD & SYNCHRONIZATION ENGINE
 * Module: Cloud & Sync Domain Types & State Models
 * 
 * Directive: DIRECTIVE 219 — ATHENA X CLOUD & SYNCHRONIZATION ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type CloudProviderType = 'google_drive' | 'onedrive' | 'dropbox' | 's3' | 'webdav' | 'nextcloud' | 'icloud';
export type SyncStatus = 'idle' | 'syncing' | 'conflict' | 'error' | 'offline';
export type ConflictResolutionStrategy = 'server_wins' | 'client_wins' | 'three_way_merge' | 'manual_review';

export interface CloudStorageMetadata {
  readonly fileId: UUID;
  readonly path: string;
  readonly checksumSha256: string;
  readonly versionNumber: number;
  readonly sizeBytes: number;
  readonly lastModifiedISO: ISO8601Timestamp;
}

export interface SyncConflictRecord {
  readonly conflictId: UUID;
  readonly resourcePath: string;
  readonly localChecksum: string;
  readonly remoteChecksum: string;
  readonly localTimestampISO: ISO8601Timestamp;
  readonly remoteTimestampISO: ISO8601Timestamp;
  readonly resolutionStrategy?: ConflictResolutionStrategy;
}

export interface CloudBackupSnapshot {
  readonly snapshotId: UUID;
  readonly provider: CloudProviderType;
  readonly createdISO: ISO8601Timestamp;
  readonly encryptedBlobSize: number;
  readonly isEncrypted: boolean;
  readonly notesArabic: string;
}

export interface CloudStatusState {
  readonly activeProvider: CloudProviderType;
  readonly isOfflineMode: boolean;
  readonly pendingSyncQueueLength: number;
  readonly activeConflictsCount: number;
  readonly totalBackupSnapshotsCount: number;
  readonly lastSyncedISO: ISO8601Timestamp;
}
