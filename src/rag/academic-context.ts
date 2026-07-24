/**
 * ==========================================================================================================
 * ATHENA X - RAG ACADEMIC RESEARCH ENGINE
 * Module: Academic Context Model & Metamodel Assembler
 * 
 * Directive: DIRECTIVE 212 — ATHENA X RAG ACADEMIC RESEARCH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { AcademicContextPayload, ScoredChunk } from './rag-types';
import { CitationAwareFormatter } from './citation-aware';

export class AcademicContextAssembler {
  private citationFormatter: CitationAwareFormatter;

  constructor() {
    this.citationFormatter = new CitationAwareFormatter();
  }

  public assembleContext(
    contextId: UUID,
    chunks: ReadonlyArray<ScoredChunk>,
    primaryLanguage: string = 'ar'
  ): Result<AcademicContextPayload, Error> {
    try {
      const citeRes = this.citationFormatter.generateCitationIndex(chunks);
      const citations = citeRes.isSuccess ? citeRes.getValue().map((c) => c.academicFootnote) : [];

      let totalTokens = 0;
      let reliabilitySum = 0;

      for (const sc of chunks) {
        totalTokens += sc.chunk.tokenCount;
        const auth = Number(sc.chunk.metadata.get('authorityScore')) || 0.90;
        reliabilitySum += auth * sc.score;
      }

      const avgReliability = chunks.length > 0 ? reliabilitySum / chunks.length : 0;

      return Result.ok({
        contextId,
        chunks,
        totalTokenCount: totalTokens,
        primaryLanguage,
        citationIndex: citations,
        averageReliabilityScore: avgReliability
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
