/**
 * ==========================================================================================================
 * ATHENA X - RAG ACADEMIC RESEARCH ENGINE
 * Barrel Export File
 * 
 * Directive: DIRECTIVE 212 — ATHENA X RAG ACADEMIC RESEARCH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

export * from './document-types';
export * from './document-loader';
export * from './document-chunker';
export * from './embedding-service';
export * from './context-assembler';
export * from './academic-generation-pipeline';
export * from './rag-engine';
export * from './rag-verification-engine';

// Directive 212 Additions
export * from './rag-types';
export { ChunkEngine } from './chunking';
export * from './embeddings';
export * from './retriever';
export * from './reranker';
export * from './retrieval';
export * from './citation-aware';
export * from './academic-context';
export * from './context-builder';
export * from './prompt-builder';
export * from './source-verification';
export * from './hallucination-detector';
export * from './cross-language';
export * from './rag-agent';
export { RAGVerificationEngine as RAGVerificationSuiteEngine } from './verification';
export * from './tests';
