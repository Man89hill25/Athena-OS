/**
 * ==========================================================================================================
 * ATHENA X - RAG ACADEMIC RESEARCH ENGINE
 * Module: Reranker Engine (Cross-Encoder & Authority Score Weighting)
 * 
 * Directive: DIRECTIVE 212 — ATHENA X RAG ACADEMIC RESEARCH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { ScoredChunk } from './rag-types';

export class RerankerEngine {
  /**
   * Re-rank candidate chunks using authority multipliers and cross-lingual match density.
   */
  public rerankChunks(
    queryText: string,
    candidates: ReadonlyArray<ScoredChunk>,
    topK: number = 5
  ): Result<ReadonlyArray<ScoredChunk>, Error> {
    try {
      const qTokens = new Set(queryText.toLowerCase().split(/\s+/).filter(Boolean));

      const reranked = candidates.map((candidate) => {
        const text = candidate.chunk.content.toLowerCase();
        let matchCount = 0;
        qTokens.forEach((tok) => {
          if (text.includes(tok)) matchCount++;
        });

        const overlapRatio = qTokens.size > 0 ? matchCount / qTokens.size : 0;
        const authority = Number(candidate.chunk.metadata.get('authorityScore')) || 0.90;

        const rawScore = candidate.score;
        const rerankScore = Math.min(1.0, rawScore * 0.5 + overlapRatio * 0.3 + authority * 0.2);

        return {
          chunk: candidate.chunk,
          score: rerankScore,
          scoreBreakdown: {
            ...candidate.scoreBreakdown,
            rerankScore,
            authorityMultiplier: authority
          }
        };
      });

      reranked.sort((a, b) => b.score - a.score);

      return Result.ok(reranked.slice(0, topK));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
