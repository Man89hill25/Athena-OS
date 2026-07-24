/**
 * ==========================================================================================================
 * ATHENA X - RAG ACADEMIC RESEARCH ENGINE
 * Subsystem: RAG Types & Domain Specifications
 * 
 * Directive: DIRECTIVE 212 — ATHENA X RAG ACADEMIC RESEARCH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type RetrievalSourceType = 
  | 'bm25'
  | 'dense'
  | 'knowledge_graph'
  | 'manuscript'
  | 'bible'
  | 'patristic'
  | 'theology'
  | 'citation'
  | 'timeline';

export type ChunkingStrategy = 
  | 'semantic'
  | 'sliding_window'
  | 'hierarchical'
  | 'adaptive';

export type LLMProviderType =
  | 'gemini'
  | 'claude'
  | 'openai'
  | 'ollama'
  | 'lmstudio'
  | 'vllm';

export interface AcademicChunk {
  readonly chunkId: UUID;
  readonly documentId: UUID;
  readonly content: string;
  readonly primaryLanguage: string;
  readonly sourceType: RetrievalSourceType;
  readonly pageNumber?: number;
  readonly sectionTitle?: string;
  readonly citationRef: string;
  readonly tokenCount: number;
  readonly metadata: ReadonlyMap<string, string | number | boolean>;
}

export interface RetrievalQuery {
  readonly queryId: UUID;
  readonly rawText: string;
  readonly normalizedText: string;
  readonly targetLanguages: ReadonlyArray<string>;
  readonly topK: number;
  readonly filterSources?: ReadonlyArray<RetrievalSourceType>;
  readonly minScoreThreshold?: number;
}

export interface ScoredChunk {
  readonly chunk: AcademicChunk;
  readonly score: number; // 0.0 to 1.0
  readonly scoreBreakdown: {
    readonly bm25Score?: number;
    readonly denseScore?: number;
    readonly rerankScore?: number;
    readonly authorityMultiplier?: number;
  };
}

export interface AcademicContextPayload {
  readonly contextId: UUID;
  readonly chunks: ReadonlyArray<ScoredChunk>;
  readonly totalTokenCount: number;
  readonly primaryLanguage: string;
  readonly citationIndex: ReadonlyArray<string>;
  readonly averageReliabilityScore: number;
}

export interface HallucinationVerificationResult {
  readonly claimText: string;
  readonly isVerified: boolean;
  readonly confidenceScore: number;
  readonly supportingEvidenceChunks: ReadonlyArray<AcademicChunk>;
  readonly verificationReasonArabic: string;
}

export interface RAGResearchResponse {
  readonly queryId: UUID;
  readonly queryText: string;
  readonly synthesizedAnswerArabic: string;
  readonly context: AcademicContextPayload;
  readonly hallucinationVerification: ReadonlyArray<HallucinationVerificationResult>;
  readonly providerUsed: LLMProviderType;
  readonly executionTimeMs: number;
  readonly createdTimestamp: ISO8601Timestamp;
}
