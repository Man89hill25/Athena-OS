/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Multi-Dimensional Academic Tagging & Taxonomy Engine
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';

export class TaggingEngine {
  private tagIndex: Map<string, Set<UUID>> = new Map();

  public tagEntity(entityId: UUID, tags: ReadonlyArray<string>): Result<void, Error> {
    try {
      for (const t of tags) {
        const clean = t.trim().toLowerCase();
        if (!this.tagIndex.has(clean)) {
          this.tagIndex.set(clean, new Set());
        }
        this.tagIndex.get(clean)!.add(entityId);
      }
      return Result.ok(undefined);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getEntitiesByTag(tag: string): Result<ReadonlySet<UUID>, Error> {
    const clean = tag.trim().toLowerCase();
    const set = this.tagIndex.get(clean) || new Set<UUID>();
    return Result.ok(set);
  }

  public getAllTags(): Result<ReadonlyArray<string>, Error> {
    return Result.ok(Array.from(this.tagIndex.keys()));
  }
}
