/**
 * ==========================================================================================================
 * ATHENA X - RAG ACADEMIC RESEARCH ENGINE
 * Module: System & Academic Prompt Builder Engine
 * 
 * Directive: DIRECTIVE 212 — ATHENA X RAG ACADEMIC RESEARCH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { LLMProviderType } from './rag-types';

export interface ConstructedRAGPrompt {
  readonly systemPromptArabic: string;
  readonly userQueryWithContext: string;
  readonly targetProvider: LLMProviderType;
}

export class PromptBuilderEngine {
  public constructPrompt(
    userQuery: string,
    formattedContext: string,
    provider: LLMProviderType = 'gemini'
  ): Result<ConstructedRAGPrompt, Error> {
    try {
      const systemPromptArabic = 
        `أنت مستشار أبحاث لاهوتية وكتابية وأبائية رفيع المستوى ببرنامج ATHENA X.\n` +
        `التزم التزاماً كاملاً بالحقائق والمراجع المتوفرة في السياق الأدبي المرفق أدناه.\n` +
        `قم بصياغة إجابة علمية دقيقة باللغة العربية مع إدراج التوثيقات والمراجع الأكاديمية بدقة متناهية، وبدون أي تخمين أو هلاوس دلالية.`;

      const userQueryWithContext = 
        `${formattedContext}\n\n` +
        `سؤال البحث العلمي المطلوب:\n${userQuery}\n\n` +
        `يرجى تقديم التخليص والتحليل الأكاديمي الشامل مع الهوامش الموثقة:`;

      return Result.ok({
        systemPromptArabic,
        userQueryWithContext,
        targetProvider: provider
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
