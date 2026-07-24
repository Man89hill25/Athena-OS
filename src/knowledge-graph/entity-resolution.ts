/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Entity Resolution & Duplicate Entity Deduplication Engine
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { KnowledgeGraph } from './knowledge-graph';
import { GraphNode } from './graph-types';

export interface DuplicatePairMatch {
  readonly nodeA: GraphNode;
  readonly nodeB: GraphNode;
  readonly similarityScore: number; // 0.0 to 1.0
  readonly matchReasonArabic: string;
}

export class EntityResolutionEngine {
  constructor(private graph: KnowledgeGraph) {}

  public findPotentialDuplicates(threshold: number = 0.8): Result<ReadonlyArray<DuplicatePairMatch>, Error> {
    try {
      const nodes = this.graph.getAllNodes();
      const duplicates: DuplicatePairMatch[] = [];

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i];
          const b = nodes[j];

          if (a.metadata.category !== b.metadata.category) continue;

          const simName = this.calculateStringSimilarity(a.metadata.primaryName, b.metadata.primaryName);
          const simArabic = this.calculateStringSimilarity(a.metadata.arabicName, b.metadata.arabicName);

          const maxSim = Math.max(simName, simArabic);

          if (maxSim >= threshold) {
            duplicates.push({
              nodeA: a,
              nodeB: b,
              similarityScore: maxSim,
              matchReasonArabic: `تشابه أسماء العقد الكنسية بين ${a.metadata.arabicName} و ${b.metadata.arabicName}`
            });
          }
        }
      }

      return Result.ok(duplicates);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private calculateStringSimilarity(s1: string, s2: string): number {
    const a = s1.toLowerCase();
    const b = s2.toLowerCase();
    if (a === b) return 1.0;
    if (a.includes(b) || b.includes(a)) return 0.85;

    let matches = 0;
    const minLength = Math.min(a.length, b.length);
    for (let i = 0; i < minLength; i++) {
      if (a[i] === b[i]) matches++;
    }
    return minLength > 0 ? matches / Math.max(a.length, b.length) : 0;
  }
}
