/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC RAG INTELLIGENCE ENGINE
 * Subsystem: Hybrid Semantic Retrieval Engine & Reciprocal Rank Fusion (RRF)
 * 
 * Directive: 207 (Academic RAG Intelligence Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { DocumentChunk, AcademicLanguage } from './document-types';
import { EmbeddingService } from './embedding-service';
import { TextNormalizer } from './document-loader';

export interface RetrievalResult {
  readonly chunk: DocumentChunk;
  readonly bm25Score: number;
  readonly vectorScore: number;
  readonly graphScore: number;
  readonly citationScore: number;
  readonly rrfScore: number;
  readonly finalRankScore: number; // Combined weighted score including academic authority
}

export interface RAGSearchOptions {
  readonly topK?: number;
  readonly language?: AcademicLanguage;
  readonly enableBM25?: boolean;
  readonly enableVectorSearch?: boolean;
  readonly enableGraphRetrieval?: boolean;
  readonly enableCitationRetrieval?: boolean;
  readonly minRelevanceThreshold?: number;
}

export class BM25Engine {
  private k1 = 1.5;
  private b = 0.75;

  public search(
    query: string,
    chunks: ReadonlyArray<DocumentChunk>,
    topK: number = 20
  ): ReadonlyArray<{ chunkId: UUID; score: number }> {
    const queryTerms = query.toLowerCase().split(/\s+/).filter((t) => t.length > 1);
    if (queryTerms.length === 0 || chunks.length === 0) return [];

    const avgDocLength = chunks.reduce((sum, c) => sum + c.metadata.tokenCount, 0) / chunks.length;
    const docFreqMap = new Map<string, number>();

    // Compute Document Frequency
    for (const term of queryTerms) {
      let df = 0;
      for (const chunk of chunks) {
        if (chunk.normalizedContent.includes(term)) df++;
      }
      docFreqMap.set(term, df);
    }

    const N = chunks.length;
    const scoredChunks: Array<{ chunkId: UUID; score: number }> = [];

    for (const chunk of chunks) {
      let score = 0;
      const docLen = chunk.metadata.tokenCount;

      for (const term of queryTerms) {
        const df = docFreqMap.get(term) || 0;
        if (df === 0) continue;

        // Inverse Document Frequency (IDF)
        const idf = Math.log((N - df + 0.5) / (df + 0.5) + 1);

        // Term Frequency in Chunk
        const matches = chunk.normalizedContent.split(term).length - 1;
        const tf = matches;

        const numerator = tf * (this.k1 + 1);
        const denominator = tf + this.k1 * (1 - this.b + this.b * (docLen / (avgDocLength || 1)));

        score += idf * (numerator / (denominator || 1));
      }

      if (score > 0) {
        scoredChunks.push({ chunkId: chunk.chunkId, score });
      }
    }

    scoredChunks.sort((a, b) => b.score - a.score);
    return scoredChunks.slice(0, topK);
  }
}

export class RAGEngine {
  private chunks: Map<UUID, DocumentChunk> = new Map();
  private bm25Engine: BM25Engine = new BM25Engine();
  private embeddingService: EmbeddingService = new EmbeddingService();

  /**
   * Index documents/chunks into the active RAG engine store.
   */
  public async indexChunks(chunks: ReadonlyArray<DocumentChunk>): Promise<Result<number, Error>> {
    try {
      for (const chunk of chunks) {
        let embedding = chunk.embedding;
        if (!embedding) {
          const embRes = await this.embeddingService.generateEmbedding(chunk.content);
          if (embRes.isSuccess) {
            embedding = embRes.getValue();
          }
        }

        const chunkWithEmb: DocumentChunk = {
          ...chunk,
          embedding,
        };

        this.chunks.set(chunk.chunkId, chunkWithEmb);
      }
      return Result.ok(this.chunks.size);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Executes hybrid retrieval across BM25, Vector, Graph, and Citation channels, fused via RRF.
   */
  public async retrieve(
    query: string,
    options?: RAGSearchOptions
  ): Promise<Result<ReadonlyArray<RetrievalResult>, Error>> {
    try {
      const topK = options?.topK || 10;
      const allChunks = Array.from(this.chunks.values());
      if (allChunks.length === 0) return Result.ok([]);

      const normalizedQuery = TextNormalizer.normalizeText(query, options?.language || 'ar');

      // 1. BM25 Retrieval
      const bm25Results = options?.enableBM25 !== false
        ? this.bm25Engine.search(normalizedQuery, allChunks, topK * 2)
        : [];

      // 2. Vector Semantic Search
      const vectorResults: Array<{ chunkId: UUID; score: number }> = [];
      if (options?.enableVectorSearch !== false) {
        const queryEmbRes = await this.embeddingService.generateEmbedding(query);
        if (queryEmbRes.isSuccess) {
          const queryEmb = queryEmbRes.getValue();
          for (const chunk of allChunks) {
            if (chunk.embedding) {
              const sim = EmbeddingService.calculateCosineSimilarity(queryEmb, chunk.embedding);
              vectorResults.push({ chunkId: chunk.chunkId, score: sim });
            }
          }
          vectorResults.sort((a, b) => b.score - a.score);
        }
      }

      // 3. Knowledge Graph Retrieval Channel
      const graphResults: Array<{ chunkId: UUID; score: number }> = [];
      if (options?.enableGraphRetrieval !== false) {
        for (const chunk of allChunks) {
          let score = 0;
          for (const entity of chunk.metadata.extractedEntities) {
            if (normalizedQuery.includes(entity.toLowerCase())) {
              score += 0.35;
            }
          }
          if (score > 0) graphResults.push({ chunkId: chunk.chunkId, score });
        }
        graphResults.sort((a, b) => b.score - a.score);
      }

      // 4. Citation Retrieval Channel
      const citationResults: Array<{ chunkId: UUID; score: number }> = [];
      if (options?.enableCitationRetrieval !== false) {
        for (const chunk of allChunks) {
          let score = 0;
          for (const anchor of chunk.metadata.citationAnchors) {
            if (normalizedQuery.includes(anchor.workTitle.toLowerCase()) || normalizedQuery.includes(anchor.standardRefStr.toLowerCase())) {
              score += 0.5;
            }
          }
          if (score > 0) citationResults.push({ chunkId: chunk.chunkId, score });
        }
        citationResults.sort((a, b) => b.score - a.score);
      }

      // 5. Reciprocal Rank Fusion (RRF) Combination
      const rrfMap = new Map<UUID, {
        bm25Score: number;
        vectorScore: number;
        graphScore: number;
        citationScore: number;
        rrfScore: number;
      }>();

      const k_rrf = 60; // Standard RRF damping constant

      const applyRRFList = (
        list: ReadonlyArray<{ chunkId: UUID; score: number }>,
        key: 'bm25Score' | 'vectorScore' | 'graphScore' | 'citationScore'
      ) => {
        list.forEach((item, rank) => {
          const rrfIncrement = 1 / (k_rrf + rank + 1);
          const existing = rrfMap.get(item.chunkId) || {
            bm25Score: 0,
            vectorScore: 0,
            graphScore: 0,
            citationScore: 0,
            rrfScore: 0,
          };
          rrfMap.set(item.chunkId, {
            ...existing,
            [key]: item.score,
            rrfScore: existing.rrfScore + rrfIncrement,
          });
        });
      };

      applyRRFList(bm25Results, 'bm25Score');
      applyRRFList(vectorResults.slice(0, topK * 2), 'vectorScore');
      applyRRFList(graphResults, 'graphScore');
      applyRRFList(citationResults, 'citationScore');

      // 6. Compute Final Weighted Score with Academic Authority
      const results: RetrievalResult[] = [];
      for (const [chunkId, scores] of rrfMap.entries()) {
        const chunk = this.chunks.get(chunkId)!;
        const academicAuthority = chunk.academicAuthorityScore || 0.9;
        const historicalConfidence = 0.95; // Historical reliability score

        const finalRankScore =
          scores.rrfScore * 0.7 + academicAuthority * 0.2 + historicalConfidence * 0.1;

        results.push({
          chunk,
          bm25Score: scores.bm25Score,
          vectorScore: scores.vectorScore,
          graphScore: scores.graphScore,
          citationScore: scores.citationScore,
          rrfScore: scores.rrfScore,
          finalRankScore,
        });
      }

      results.sort((a, b) => b.finalRankScore - a.finalRankScore);

      const minThreshold = options?.minRelevanceThreshold || 0.001;
      const filtered = results.filter((r) => r.finalRankScore >= minThreshold).slice(0, topK);

      return Result.ok(filtered);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getIndexedChunkCount(): number {
    return this.chunks.size;
  }
}
