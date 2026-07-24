/**
 * ==========================================================================================================
 * ATHENA X - RAG ACADEMIC RESEARCH ENGINE
 * Module: Chunking Engine (Semantic, Sliding Window, Hierarchical, Adaptive)
 * 
 * Directive: DIRECTIVE 212 — ATHENA X RAG ACADEMIC RESEARCH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { AcademicChunk, ChunkingStrategy, RetrievalSourceType } from './rag-types';

export interface ChunkingOptions {
  readonly strategy: ChunkingStrategy;
  readonly chunkSizeTokens?: number;
  readonly overlapTokens?: number;
  readonly minChunkTokens?: number;
}

export class ChunkEngine {
  /**
   * Split academic raw document text into structured AcademicChunks.
   */
  public chunkDocument(
    documentId: UUID,
    title: string,
    rawContent: string,
    sourceType: RetrievalSourceType,
    primaryLanguage: string,
    options: ChunkingOptions
  ): Result<ReadonlyArray<AcademicChunk>, Error> {
    try {
      const strategy = options.strategy || 'semantic';
      let chunks: AcademicChunk[] = [];

      switch (strategy) {
        case 'semantic':
          chunks = this.semanticChunking(documentId, title, rawContent, sourceType, primaryLanguage, options);
          break;
        case 'sliding_window':
          chunks = this.slidingWindowChunking(documentId, title, rawContent, sourceType, primaryLanguage, options);
          break;
        case 'hierarchical':
          chunks = this.hierarchicalChunking(documentId, title, rawContent, sourceType, primaryLanguage, options);
          break;
        case 'adaptive':
          chunks = this.adaptiveChunking(documentId, title, rawContent, sourceType, primaryLanguage, options);
          break;
      }

      return Result.ok(chunks);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private semanticChunking(
    docId: UUID,
    title: string,
    content: string,
    sourceType: RetrievalSourceType,
    language: string,
    opts: ChunkingOptions
  ): AcademicChunk[] {
    const paragraphs = content.split(/\n\s*\n/).filter((p) => p.trim().length > 0);
    const chunks: AcademicChunk[] = [];

    paragraphs.forEach((p, idx) => {
      const tokens = Math.ceil(p.length / 4);
      chunks.push({
        chunkId: `chunk-${docId}-${idx + 1}`,
        documentId: docId,
        content: p.trim(),
        primaryLanguage: language,
        sourceType,
        sectionTitle: `${title} - Section ${idx + 1}`,
        citationRef: `${title}, §${idx + 1}`,
        tokenCount: tokens,
        metadata: new Map<string, string | number | boolean>([
          ['chunkingStrategy', 'semantic'],
          ['paragraphIndex', idx + 1]
        ])
      });
    });

    return chunks;
  }

  private slidingWindowChunking(
    docId: UUID,
    title: string,
    content: string,
    sourceType: RetrievalSourceType,
    language: string,
    opts: ChunkingOptions
  ): AcademicChunk[] {
    const size = opts.chunkSizeTokens || 250;
    const overlap = opts.overlapTokens || 50;
    const words = content.split(/\s+/).filter(Boolean);
    const chunks: AcademicChunk[] = [];

    let start = 0;
    let chunkIndex = 1;

    while (start < words.length) {
      const end = Math.min(words.length, start + size);
      const slice = words.slice(start, end).join(' ');
      const tokens = Math.ceil(slice.length / 4);

      chunks.push({
        chunkId: `chunk-slide-${docId}-${chunkIndex}`,
        documentId: docId,
        content: slice,
        primaryLanguage: language,
        sourceType,
        citationRef: `${title}, p.${chunkIndex}`,
        tokenCount: tokens,
        metadata: new Map<string, string | number | boolean>([
          ['chunkingStrategy', 'sliding_window'],
          ['startWord', start],
          ['endWord', end]
        ])
      });

      if (end >= words.length) break;
      start += size - overlap;
      chunkIndex++;
    }

    return chunks;
  }

  private hierarchicalChunking(
    docId: UUID,
    title: string,
    content: string,
    sourceType: RetrievalSourceType,
    language: string,
    opts: ChunkingOptions
  ): AcademicChunk[] {
    // Parent-child hierarchical split
    const sections = content.split(/(?=\n#{1,3}\s)/).filter((s) => s.trim().length > 0);
    const chunks: AcademicChunk[] = [];

    sections.forEach((sec, idx) => {
      const tokens = Math.ceil(sec.length / 4);
      chunks.push({
        chunkId: `chunk-hier-${docId}-${idx + 1}`,
        documentId: docId,
        content: sec.trim(),
        primaryLanguage: language,
        sourceType,
        sectionTitle: `${title} - Hierarchy Level ${idx + 1}`,
        citationRef: `${title}, Division ${idx + 1}`,
        tokenCount: tokens,
        metadata: new Map<string, string | number | boolean>([
          ['chunkingStrategy', 'hierarchical'],
          ['hierarchyDepth', 1]
        ])
      });
    });

    return chunks;
  }

  private adaptiveChunking(
    docId: UUID,
    title: string,
    content: string,
    sourceType: RetrievalSourceType,
    language: string,
    opts: ChunkingOptions
  ): AcademicChunk[] {
    // Adaptive based on punctuation and density
    const sentences = content.split(/(?<=[.!?؟])\s+/).filter(Boolean);
    const chunks: AcademicChunk[] = [];
    let currentBuffer: string[] = [];
    let currentTokens = 0;
    let chunkIdx = 1;

    for (const sentence of sentences) {
      const sTokens = Math.ceil(sentence.length / 4);
      if (currentTokens + sTokens > (opts.chunkSizeTokens || 200) && currentBuffer.length > 0) {
        const text = currentBuffer.join(' ');
        chunks.push({
          chunkId: `chunk-adapt-${docId}-${chunkIdx}`,
          documentId: docId,
          content: text,
          primaryLanguage: language,
          sourceType,
          citationRef: `${title}, Para ${chunkIdx}`,
          tokenCount: currentTokens,
          metadata: new Map<string, string | number | boolean>([['chunkingStrategy', 'adaptive']])
        });
        currentBuffer = [];
        currentTokens = 0;
        chunkIdx++;
      }
      currentBuffer.push(sentence);
      currentTokens += sTokens;
    }

    if (currentBuffer.length > 0) {
      chunks.push({
        chunkId: `chunk-adapt-${docId}-${chunkIdx}`,
        documentId: docId,
        content: currentBuffer.join(' '),
        primaryLanguage: language,
        sourceType,
        citationRef: `${title}, Para ${chunkIdx}`,
        tokenCount: currentTokens,
        metadata: new Map<string, string | number | boolean>([['chunkingStrategy', 'adaptive']])
      });
    }

    return chunks;
  }
}
