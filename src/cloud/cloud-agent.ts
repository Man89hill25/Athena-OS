/**
 * ==========================================================================================================
 * ATHENA X - CLOUD & SYNCHRONIZATION ENGINE
 * Module: Unified Cloud Orchestrator & Autonomous Sync Agent
 * 
 * Directive: DIRECTIVE 219 — ATHENA X CLOUD & SYNCHRONIZATION ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { CloudStatusState, CloudProviderType } from './cloud-types';
import { SyncEngine } from './sync-engine';
import { BackupEngine } from './backup-engine';
import { ConflictEngine } from './conflict-engine';
import { OfflineSyncEngine } from './offline-sync';

export class CloudAgent {
  private syncEngine = new SyncEngine();
  private backupEngine = new BackupEngine();
  private conflictEngine = new ConflictEngine();
  private offlineSyncEngine = new OfflineSyncEngine();
  private activeProvider: CloudProviderType = 'google_drive';

  public async getCloudStatus(): Promise<Result<CloudStatusState, Error>> {
    try {
      return Result.ok({
        activeProvider: this.activeProvider,
        isOfflineMode: false,
        pendingSyncQueueLength: this.offlineSyncEngine.getPendingQueue().length,
        activeConflictsCount: this.conflictEngine.getActiveConflicts().length,
        totalBackupSnapshotsCount: this.backupEngine.listBackups().length,
        lastSyncedISO: new Date().toISOString()
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async triggerManualSync(): Promise<Result<{ syncedCount: number }, Error>> {
    const res = await this.syncEngine.executeFullSync(this.activeProvider);
    if (res.isFailure) return Result.fail(res.getError());
    return Result.ok({ syncedCount: res.getValue().syncedItemsCount });
  }
}
