/**
 * ==========================================================================================================
 * ATHENA X - RAG ACADEMIC RESEARCH ENGINE
 * Module: Retrieval Strategy Orchestrator & Multi-Retriever Manager
 * 
 * Directive: DIRECTIVE 212 — ATHENA X RAG ACADEMIC RESEARCH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { AcademicChunk, RetrievalQuery, ScoredChunk } from './rag-types';
import { AcademicRetrieverEngine } from './retriever';
import { RerankerEngine } from './reranker';

export class RetrievalOrchestrator {
  private baseRetriever: AcademicRetrieverEngine;
  private reranker: RerankerEngine;

  constructor(baseRetriever?: AcademicRetrieverEngine) {
    this.baseRetriever = baseRetriever || new AcademicRetrieverEngine();
    this.reranker = new RerankerEngine();
  }

  public registerChunk(chunk: AcademicChunk): void {
    this.baseRetriever.registerChunk(chunk);
  }

  public executeHybridRetrieval(query: RetrievalQuery): Result<ReadonlyArray<ScoredChunk>, Error> {
    const rawRes = this.baseRetriever.retrieve(query);
    if (rawRes.isFailure) return Result.fail(rawRes.getError());

    const rawCandidates = rawRes.getValue();
    return this.reranker.rerankChunks(query.normalizedText, rawCandidates, query.topK);
  }
}
