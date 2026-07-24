/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: Context Engine & Window Manager
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { ContextRetrievedEvidence } from './ai-context';

export interface ContextChunk {
  readonly chunkId: string;
  readonly text: string;
  readonly tokenEstimate: number;
  readonly language: 'ar' | 'en' | 'grc' | 'la' | 'cop' | 'syr' | 'other';
  readonly sourceMetadata?: Record<string, unknown>;
}

export class ChunkPlanner {
  public static chunkDocument(
    documentText: string,
    maxChunkTokens = 1000,
    overlapTokens = 100,
    language: 'ar' | 'en' | 'grc' | 'la' | 'cop' | 'syr' | 'other' = 'ar'
  ): ReadonlyArray<ContextChunk> {
    const approxCharsPerToken = language === 'ar' ? 3 : 4;
    const maxChars = maxChunkTokens * approxCharsPerToken;
    const overlapChars = overlapTokens * approxCharsPerToken;

    const chunks: ContextChunk[] = [];
    let start = 0;
    let chunkIndex = 0;

    while (start < documentText.length) {
      const end = Math.min(start + maxChars, documentText.length);
      const text = documentText.slice(start, end);

      chunks.push({
        chunkId: `chunk_${chunkIndex++}`,
        text,
        tokenEstimate: Math.ceil(text.length / approxCharsPerToken),
        language,
      });

      if (end >= documentText.length) break;
      start += maxChars - overlapChars;
    }

    return chunks;
  }
}

export class ContextWindowManager {
  public static estimateTokens(text: string): number {
    return Math.ceil(text.length / 3.5);
  }

  public static pruneEvidenceToFitWindow(
    evidenceList: ReadonlyArray<ContextRetrievedEvidence>,
    maxAllowedTokens: number
  ): ReadonlyArray<ContextRetrievedEvidence> {
    let currentTokens = 0;
    const fitted: ContextRetrievedEvidence[] = [];

    // Sort evidence by relevance score descending
    const sorted = [...evidenceList].sort((a, b) => b.relevanceScore - a.relevanceScore);

    for (const ev of sorted) {
      const tokens = ContextWindowManager.estimateTokens(ev.snippet);
      if (currentTokens + tokens <= maxAllowedTokens) {
        fitted.push(ev);
        currentTokens += tokens;
      }
    }

    return fitted;
  }
}

export class ContextBuilder {
  private systemPrompt = '';
  private userInstruction = '';
  private evidence: ContextRetrievedEvidence[] = [];
  private academicNotes: string[] = [];

  public setSystemPrompt(prompt: string): ContextBuilder {
    this.systemPrompt = prompt;
    return this;
  }

  public setUserInstruction(instruction: string): ContextBuilder {
    this.userInstruction = instruction;
    return this;
  }

  public addEvidence(evidenceList: ReadonlyArray<ContextRetrievedEvidence>): ContextBuilder {
    this.evidence.push(...evidenceList);
    return this;
  }

  public addAcademicNote(note: string): ContextBuilder {
    this.academicNotes.push(note);
    return this;
  }

  public buildFormattedPrompt(maxTokens = 32000): string {
    const fittedEvidence = ContextWindowManager.pruneEvidenceToFitWindow(this.evidence, maxTokens / 2);

    const evidenceSection = fittedEvidence.map(
      (ev, i) => `[المصدر ${i + 1}]: ${ev.title} (${ev.sourceUri})\n${ev.snippet}`
    ).join('\n\n');

    const notesSection = this.academicNotes.join('\n');

    return `
=== SYSTEM INSTRUCTION ===
${this.systemPrompt}

=== ACADEMIC NOTES & RULES ===
${notesSection}

=== RETRIEVED PRIMARY EVIDENCE ===
${evidenceSection.length > 0 ? evidenceSection : 'لا توجد أدلة نصية مقترنة مسبقاً.'}

=== USER QUERY ===
${this.userInstruction}
`.trim();
  }
}
