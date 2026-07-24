/**
 * ==========================================================================================================
 * ATHENA X - RAG ACADEMIC RESEARCH ENGINE
 * Module: Context Builder & Token Budget Manager
 * 
 * Directive: DIRECTIVE 212 — ATHENA X RAG ACADEMIC RESEARCH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { AcademicContextPayload } from './rag-types';

export class ContextBuilder {
  /**
   * Compress and trim context chunks to satisfy token budget limits.
   */
  public buildPromptContext(
    payload: AcademicContextPayload,
    maxTokenBudget: number = 2000
  ): Result<string, Error> {
    try {
      let currentTokens = 0;
      let promptContextText = "--- BREADCRUMBS & ACADEMIC EVIDENCE CONTEXT ---\n\n";

      for (let i = 0; i < payload.chunks.length; i++) {
        const sc = payload.chunks[i];
        if (currentTokens + sc.chunk.tokenCount > maxTokenBudget) {
          break; // Stop when exceeding token budget
        }

        const ref = payload.citationIndex[i] || `[${i + 1}] ${sc.chunk.citationRef}`;
        promptContextText += `EVIDENCE ITEM ${ref}:\n`;
        promptContextText += `${sc.chunk.content}\n\n`;

        currentTokens += sc.chunk.tokenCount;
      }

      promptContextText += "--- END ACADEMIC CONTEXT ---\n";

      return Result.ok(promptContextText);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
