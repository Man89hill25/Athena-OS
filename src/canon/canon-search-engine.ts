/**
 * ==========================================================================================================
 * ATHENA X - CANONICAL LAW & ECCLESIASTICAL KNOWLEDGE INTELLIGENCE ENGINE
 * Subsystem: Canonical Search Engine
 * 
 * Directive: 211 (Canonical Law & Ecclesiastical Knowledge Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { CanonCorpusEngine } from './canon-corpus-engine';
import { EcclesiasticalCanon, CanonicalTradition, Jurisdiction } from './canon-types';

export interface CanonSearchQuery {
  readonly query: string;
  readonly canonNumber?: number;
  readonly councilName?: string;
  readonly tradition?: CanonicalTradition;
  readonly jurisdiction?: Jurisdiction;
  readonly startYearCE?: number;
  readonly endYearCE?: number;
  readonly topK?: number;
}

export interface CanonSearchResultHit {
  readonly canon: EcclesiasticalCanon;
  readonly canonicalAuthorityScore: number; // 0.0 to 1.0
  readonly historicalReliabilityScore: number; // 0.0 to 1.0
  readonly councilEvidenceScore: number; // 0.0 to 1.0
  readonly manuscriptSupportScore: number; // 0.0 to 1.0
  readonly compositeScore: number; // Combined hybrid score
  readonly matchedSnippet: string;
}

export class CanonicalSearchEngine {
  private corpusEngine: CanonCorpusEngine;

  constructor(corpusEngine?: CanonCorpusEngine) {
    this.corpusEngine = corpusEngine || new CanonCorpusEngine();
  }

  public async search(request: CanonSearchQuery): Promise<Result<ReadonlyArray<CanonSearchResultHit>, Error>> {
    try {
      const candidates = this.corpusEngine.queryCanons({
        query: request.query,
        canonNumber: request.canonNumber,
        councilName: request.councilName,
        tradition: request.tradition,
        jurisdiction: request.jurisdiction,
      });

      const topK = request.topK || 10;
      const hits: CanonSearchResultHit[] = [];

      for (const canon of candidates) {
        if (request.startYearCE && canon.dateEnactedCE < request.startYearCE) continue;
        if (request.endYearCE && canon.dateEnactedCE > request.endYearCE) continue;

        // Calculate Ranking Metrics
        const authorityScore = canon.jurisdiction === 'Universal Ecumenical' ? 0.99 : 0.90;
        const reliabilityScore = canon.historicalConfidence;
        const councilEvidenceScore = canon.councilName ? 0.98 : 0.82;
        const manuscriptSupportScore = 0.95;

        // Composite Hybrid Ranking Score
        const compositeScore = Number((
          authorityScore * 0.35 +
          reliabilityScore * 0.25 +
          councilEvidenceScore * 0.25 +
          manuscriptSupportScore * 0.15
        ).toFixed(3));

        hits.push({
          canon,
          canonicalAuthorityScore: authorityScore,
          historicalReliabilityScore: reliabilityScore,
          councilEvidenceScore,
          manuscriptSupportScore,
          compositeScore,
          matchedSnippet: `القانون ${canon.canonNumber} من [${canon.collectionTitle}]: "${canon.arabicText}"`,
        });
      }

      // Sort descending by compositeScore
      hits.sort((a, b) => b.compositeScore - a.compositeScore);

      return Result.ok(hits.slice(0, topK));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
