/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: AI Response Engine
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';
import { AcademicMetadata, AgentTraceStep, ExecutionPlan, TokenUsage, VerificationStatus } from './ai-types';

export interface AIResponseParams {
  readonly responseId?: UUID;
  readonly requestId: UUID;
  readonly content: string;
  readonly summary?: string;
  readonly academicMetadata: AcademicMetadata;
  readonly agentTrace: ReadonlyArray<AgentTraceStep>;
  readonly executionPlan?: ExecutionPlan;
  readonly tokenUsage: TokenUsage;
  readonly timingMs: number;
  readonly timestamp?: ISO8601Timestamp;
}

/**
 * Immutable Representation of an Academic AI Response
 */
export class AIResponse {
  public readonly responseId: UUID;
  public readonly requestId: UUID;
  public readonly content: string;
  public readonly summary: string;
  public readonly academicMetadata: AcademicMetadata;
  public readonly agentTrace: ReadonlyArray<AgentTraceStep>;
  public readonly executionPlan?: ExecutionPlan;
  public readonly tokenUsage: TokenUsage;
  public readonly timingMs: number;
  public readonly timestamp: ISO8601Timestamp;

  constructor(params: AIResponseParams) {
    this.responseId = params.responseId || crypto.randomUUID();
    this.requestId = params.requestId;
    this.content = params.content;
    this.summary = params.summary || (params.content.length > 200 ? params.content.slice(0, 197) + '...' : params.content);
    this.academicMetadata = params.academicMetadata;
    this.agentTrace = [...params.agentTrace];
    this.executionPlan = params.executionPlan;
    this.tokenUsage = params.tokenUsage;
    this.timingMs = params.timingMs;
    this.timestamp = params.timestamp || (new Date().toISOString() as ISO8601Timestamp);

    Object.freeze(this.academicMetadata);
    Object.freeze(this.agentTrace);
    Object.freeze(this.tokenUsage);
    Object.freeze(this);
  }

  public isVerified(): boolean {
    return (
      this.academicMetadata.verificationStatus === 'VERIFIED' &&
      this.academicMetadata.academicReliabilityScore >= 0.8
    );
  }

  public getFormattedCitations(style: 'CHICAGO' | 'APA' | 'MLA' = 'CHICAGO'): ReadonlyArray<string> {
    return this.academicMetadata.citations.map((c, index) => {
      const num = index + 1;
      if (style === 'CHICAGO') {
        const vol = c.volume ? `, vol. ${c.volume}` : '';
        const pg = c.page ? `, p. ${c.page}` : '';
        const yr = c.year ? ` (${c.year})` : '';
        return `[${num}] ${c.author}, "${c.workTitle}"${vol}${yr}${pg}. [Status: ${c.verificationStatus}]`;
      }
      return `[${num}] ${c.author} (${c.year || 'n.d.'}). ${c.workTitle}. [Status: ${c.verificationStatus}]`;
    });
  }

  public toAcademicReport(): string {
    const citationsHeader = this.getFormattedCitations().join('\n');
    return `
================================================================================
ATHENA X ACADEMIC AI REPORT
Response ID: ${this.responseId} | Request ID: ${this.requestId}
Verification Status: ${this.academicMetadata.verificationStatus}
Confidence Score: ${(this.academicMetadata.confidenceScore * 100).toFixed(1)}% | Reliability: ${(this.academicMetadata.academicReliabilityScore * 100).toFixed(1)}%
================================================================================

${this.content}

--------------------------------------------------------------------------------
CITATIONS & SOURCES
--------------------------------------------------------------------------------
${citationsHeader.length > 0 ? citationsHeader : 'No explicit citations attached.'}

Sources: ${this.academicMetadata.sources.join(', ') || 'Internal Knowledge Base'}
Executed by Agents: ${this.agentTrace.map((t) => t.agentId).join(' -> ')}
Duration: ${this.timingMs}ms | Tokens: ${this.tokenUsage.totalTokens}
`.trim();
  }
}
