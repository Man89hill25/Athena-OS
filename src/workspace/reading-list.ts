/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Academic Reading List & Syllabus Tracker Engine
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { ReadingListItem } from './workspace-types';

export class ReadingListEngine {
  private items: Map<UUID, ReadingListItem> = new Map();

  public addReadingItem(
    title: string,
    author: string,
    libraryItemId?: UUID
  ): Result<ReadingListItem, Error> {
    try {
      const itemId = `read-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const rec: ReadingListItem = {
        itemId,
        title,
        author,
        libraryItemId,
        readingProgressPercentage: 0,
        status: 'unread'
      };

      this.items.set(itemId, rec);
      return Result.ok(rec);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public updateReadingProgress(itemId: UUID, progressPercentage: number): Result<ReadingListItem, Error> {
    try {
      const item = this.items.get(itemId);
      if (!item) {
        return Result.fail(new Error(`Reading item ${itemId} not found.`));
      }

      const clamped = Math.min(100, Math.max(0, progressPercentage));
      let status: 'unread' | 'reading' | 'completed' = 'reading';
      if (clamped === 0) status = 'unread';
      if (clamped === 100) status = 'completed';

      const updated: ReadingListItem = {
        ...item,
        readingProgressPercentage: clamped,
        status
      };

      this.items.set(itemId, updated);
      return Result.ok(updated);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getAllReadingItems(): Result<ReadonlyArray<ReadingListItem>, Error> {
    return Result.ok(Array.from(this.items.values()));
  }
}
