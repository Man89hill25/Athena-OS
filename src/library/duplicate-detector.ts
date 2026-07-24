/**
 * ==========================================================================================================
 * ATHENA X - DIGITAL LIBRARY PLATFORM
 * Module: Bibliographic Duplicate Detection Engine
 * 
 * Directive: DIRECTIVE 214 — ATHENA X DIGITAL LIBRARY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { LibraryItemRecord } from './library-types';

export class DuplicateDetectorEngine {
  public checkForDuplicates(
    newItem: LibraryItemRecord,
    existingItems: ReadonlyArray<LibraryItemRecord>
  ): Result<ReadonlyArray<LibraryItemRecord>, Error> {
    try {
      const duplicates: LibraryItemRecord[] = [];

      for (const item of existingItems) {
        if (item.itemId === newItem.itemId) continue;

        // ISBN / DOI exact match
        if (
          (newItem.identifiers.isbn && newItem.identifiers.isbn === item.identifiers.isbn) ||
          (newItem.identifiers.doi && newItem.identifiers.doi === item.identifiers.doi)
        ) {
          duplicates.push(item);
          continue;
        }

        // Title and Author match
        const cleanTitle1 = newItem.title.trim().toLowerCase();
        const cleanTitle2 = item.title.trim().toLowerCase();
        const cleanAuth1 = newItem.authorOrCreator.trim().toLowerCase();
        const cleanAuth2 = item.authorOrCreator.trim().toLowerCase();

        if (cleanTitle1 === cleanTitle2 && cleanAuth1 === cleanAuth2) {
          duplicates.push(item);
        }
      }

      return Result.ok(duplicates);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
