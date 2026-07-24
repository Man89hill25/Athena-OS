/**
 * ==========================================================================================================
 * ATHENA X - ACADEMIC RAG INTELLIGENCE ENGINE
 * Subsystem: Context Assembler & Token Budgeting Engine
 * 
 * Directive: 207 (Academic RAG Intelligence Engine)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { RetrievalResult } from './rag-engine';
import { CitationAnchor } from './document-types';

export interface GroupedEvidence {
  readonly documentId: string;
  readonly docTitle: string;
  readonly authorityScore: number;
  readonly chunks: ReadonlyArray<RetrievalResult>;
  readonly citationAnchors: ReadonlyArray<CitationAnchor>;
}

export interface AssembledContext {
  readonly formattedContextPrompt: string;
  readonly groupedEvidence: ReadonlyArray<GroupedEvidence>;
  readonly totalTokensUsed: number;
  readonly citationAnchorsCount: number;
  readonly sourcesCount: number;
}

export interface ContextAssemblerOptions {
  readonly maxTokenBudget?: number; // e.g. 3000
  readonly preserveAllCitations?: boolean;
  readonly groupSourcesByDoc?: boolean;
  readonly languageHeader?: string;
}

export class ContextAssembler {
  /**
   * Assembles retrieved search results into a clean, token-budgeted prompt context.
   */
  public static assembleContext(
    retrievedResults: ReadonlyArray<RetrievalResult>,
    options?: ContextAssemblerOptions
  ): Result<AssembledContext, Error> {
    try {
      const maxTokens = options?.maxTokenBudget || 3500;
      let usedTokens = 0;

      const selectedResults: RetrievalResult[] = [];
      const citationMap = new Map<string, CitationAnchor>();

      // 1. Token Budgeting Selection
      for (const res of retrievedResults) {
        const chunkTokens = res.chunk.metadata.tokenCount;
        if (usedTokens + chunkTokens > maxTokens) {
          break; // Token budget cap reached
        }
        selectedResults.push(res);
        usedTokens += chunkTokens;

        for (const anchor of res.chunk.metadata.citationAnchors) {
          citationMap.set(anchor.standardRefStr, anchor);
        }
      }

      // 2. Evidence Grouping by Document
      const docGroupMap = new Map<string, GroupedEvidence>();

      for (const res of selectedResults) {
        const docId = res.chunk.documentId;
        const existing = docGroupMap.get(docId);

        const currentAnchors = res.chunk.metadata.citationAnchors;
        if (existing) {
          docGroupMap.set(docId, {
            ...existing,
            chunks: [...existing.chunks, res],
            citationAnchors: [...existing.citationAnchors, ...currentAnchors],
          });
        } else {
          docGroupMap.set(docId, {
            documentId: docId,
            docTitle: `وثيقة أثينا الأكاديمية [${docId.slice(0, 8)}]`,
            authorityScore: res.chunk.academicAuthorityScore || 0.9,
            chunks: [res],
            citationAnchors: [...currentAnchors],
          });
        }
      }

      const groupedEvidence = Array.from(docGroupMap.values());

      // 3. Format Prompt Context String
      let contextText = `=== السياق الأكاديمي الموثق (ATHENA ACADEMIC EVIDENTIAL CONTEXT) ===\n\n`;

      groupedEvidence.forEach((group, gIdx) => {
        contextText += `--- المصدر [${gIdx + 1}]: ${group.docTitle} (درجة الموثوقية: ${(group.authorityScore * 100).toFixed(0)}%) ---\n`;
        group.chunks.forEach((c, cIdx) => {
          contextText += `[مقطع ${cIdx + 1}] (درجة الملاءمة: ${c.finalRankScore.toFixed(3)})\n`;
          contextText += `${c.chunk.content}\n`;
          if (c.chunk.metadata.citationAnchors.length > 0) {
            contextText += `[المراجع المباشرة: ${c.chunk.metadata.citationAnchors.map((a) => a.standardRefStr).join('; ')}]\n`;
          }
          contextText += `\n`;
        });
      });

      contextText += `=== نهاية الأدلة الأكاديمية ===\n`;

      return Result.ok({
        formattedContextPrompt: contextText,
        groupedEvidence,
        totalTokensUsed: usedTokens,
        citationAnchorsCount: citationMap.size,
        sourcesCount: groupedEvidence.length,
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
