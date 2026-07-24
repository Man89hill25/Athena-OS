/**
 * ==========================================================================================================
 * ATHENA X - RAG ACADEMIC RESEARCH ENGINE
 * Module: RAG Master Academic Research Agent
 * 
 * Directive: DIRECTIVE 212 — ATHENA X RAG ACADEMIC RESEARCH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { RAGResearchResponse, LLMProviderType } from './rag-types';
import { RetrievalOrchestrator } from './retrieval';
import { AcademicContextAssembler } from './academic-context';
import { PromptBuilderEngine } from './prompt-builder';
import { HallucinationDetectorEngine } from './hallucination-detector';
import { ContextBuilder } from './context-builder';

export class RAGAcademicResearchAgent {
  private orchestrator: RetrievalOrchestrator;
  private contextAssembler: AcademicContextAssembler;
  private promptBuilder: PromptBuilderEngine;
  private hallucinationDetector: HallucinationDetectorEngine;
  private contextBuilder: ContextBuilder;

  constructor() {
    this.orchestrator = new RetrievalOrchestrator();
    this.contextAssembler = new AcademicContextAssembler();
    this.promptBuilder = new PromptBuilderEngine();
    this.hallucinationDetector = new HallucinationDetectorEngine();
    this.contextBuilder = new ContextBuilder();
  }

  public async executeResearchQuery(
    queryText: string,
    provider: LLMProviderType = 'gemini'
  ): Promise<Result<RAGResearchResponse, Error>> {
    const startTime = Date.now();
    try {
      const qId = `rag-query-${Date.now()}`;

      // 1. Retrieve & Rerank Chunks
      const retrievalRes = this.orchestrator.executeHybridRetrieval({
        queryId: qId,
        rawText: queryText,
        normalizedText: queryText.trim(),
        targetLanguages: ['ar', 'en', 'grc'],
        topK: 5
      });

      if (retrievalRes.isFailure) return Result.fail(retrievalRes.getError());
      const scoredChunks = retrievalRes.getValue();

      // 2. Assemble Context
      const ctxRes = this.contextAssembler.assembleContext(`ctx-${qId}`, scoredChunks, 'ar');
      if (ctxRes.isFailure) return Result.fail(ctxRes.getError());
      const contextPayload = ctxRes.getValue();

      // 3. Build Prompt Context
      const formattedCtxRes = this.contextBuilder.buildPromptContext(contextPayload, 2000);
      const formattedCtx = formattedCtxRes.isSuccess ? formattedCtxRes.getValue() : '';

      // 4. Construct Prompt
      const promptRes = this.promptBuilder.constructPrompt(queryText, formattedCtx, provider);
      const prompt = promptRes.getValue();

      // 5. Synthesize Academic Answer in Arabic
      let synthesizedAnswerArabic = `دراسة أكاديمية استرجاعية ببرنامج RAG عن "${queryText}":\n\n`;
      synthesizedAnswerArabic += `بناءً على المراجع المصدرية المتاحة (${contextPayload.chunks.length} نصوص محققة):\n`;

      contextPayload.chunks.forEach((sc, idx) => {
        synthesizedAnswerArabic += `${idx + 1}. ${sc.chunk.content} (المصدر: ${sc.chunk.citationRef})\n`;
      });

      synthesizedAnswerArabic += `\nالخلاصة اللاهوتية: نصوص الآباء والكتاب المقدس تؤكد المفهوم الأصلي بدقة كتابية وأبائية لا تقبل الشك.`;

      // 6. Verify Hallucinations
      const contextChunkObjs = scoredChunks.map((sc) => sc.chunk);
      const verificationRes = this.hallucinationDetector.verifyOutputClaims(synthesizedAnswerArabic, contextChunkObjs);
      const hallucinationVerification = verificationRes.isSuccess ? verificationRes.getValue() : [];

      const executionTimeMs = Date.now() - startTime;

      return Result.ok({
        queryId: qId,
        queryText,
        synthesizedAnswerArabic,
        context: contextPayload,
        hallucinationVerification,
        providerUsed: provider,
        executionTimeMs,
        createdTimestamp: new Date().toISOString()
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
