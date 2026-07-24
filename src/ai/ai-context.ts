/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: AI Context Engine
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';
import { AIExecutionMode, AgentPermissions } from './ai-types';

export interface ContextUserPreferences {
  readonly language: 'ar' | 'en' | 'grc' | 'la' | 'cop' | 'syr';
  readonly citationStyle: 'CHICAGO' | 'APA' | 'MLA' | 'HARVARD';
  readonly academicStrictness: 'STRICT' | 'BALANCED' | 'EXPLORATORY';
  readonly defaultExecutionMode: AIExecutionMode;
}

export interface ContextRetrievedEvidence {
  readonly sourceUri: string;
  readonly title: string;
  readonly snippet: string;
  readonly relevanceScore: number;
  readonly volume?: string;
  readonly page?: string;
}

export interface AIContextParams {
  readonly contextId?: UUID;
  readonly userId: UUID;
  readonly projectId?: UUID;
  readonly documentId?: UUID;
  readonly currentDocumentText?: string;
  readonly retrievedEvidence?: ReadonlyArray<ContextRetrievedEvidence>;
  readonly userPreferences?: ContextUserPreferences;
  readonly activeMode?: AIExecutionMode;
  readonly createdTimestamp?: ISO8601Timestamp;
}

/**
 * Immutable Context Container passed across AI Agents and Subsystems
 */
export class AIContext {
  public readonly contextId: UUID;
  public readonly userId: UUID;
  public readonly projectId?: UUID;
  public readonly documentId?: UUID;
  public readonly currentDocumentText?: string;
  public readonly retrievedEvidence: ReadonlyArray<ContextRetrievedEvidence>;
  public readonly userPreferences: ContextUserPreferences;
  public readonly activeMode: AIExecutionMode;
  public readonly createdTimestamp: ISO8601Timestamp;

  constructor(params: AIContextParams) {
    this.contextId = params.contextId || crypto.randomUUID();
    this.userId = params.userId;
    this.projectId = params.projectId;
    this.documentId = params.documentId;
    this.currentDocumentText = params.currentDocumentText;
    this.retrievedEvidence = params.retrievedEvidence ? [...params.retrievedEvidence] : [];
    this.userPreferences = params.userPreferences || {
      language: 'ar',
      citationStyle: 'CHICAGO',
      academicStrictness: 'STRICT',
      defaultExecutionMode: 'hybrid',
    };
    this.activeMode = params.activeMode || this.userPreferences.defaultExecutionMode;
    this.createdTimestamp = params.createdTimestamp || (new Date().toISOString() as ISO8601Timestamp);

    Object.freeze(this.retrievedEvidence);
    Object.freeze(this.userPreferences);
    Object.freeze(this);
  }

  public withRetrievedEvidence(
    evidence: ReadonlyArray<ContextRetrievedEvidence>
  ): AIContext {
    return new AIContext({
      contextId: this.contextId,
      userId: this.userId,
      projectId: this.projectId,
      documentId: this.documentId,
      currentDocumentText: this.currentDocumentText,
      retrievedEvidence: [...this.retrievedEvidence, ...evidence],
      userPreferences: this.userPreferences,
      activeMode: this.activeMode,
      createdTimestamp: this.createdTimestamp,
    });
  }

  public withActiveMode(mode: AIExecutionMode): AIContext {
    return new AIContext({
      contextId: this.contextId,
      userId: this.userId,
      projectId: this.projectId,
      documentId: this.documentId,
      currentDocumentText: this.currentDocumentText,
      retrievedEvidence: this.retrievedEvidence,
      userPreferences: this.userPreferences,
      activeMode: mode,
      createdTimestamp: this.createdTimestamp,
    });
  }

  public validatePermissions(permissions: AgentPermissions): boolean {
    if (this.activeMode === 'offline' && permissions.canAccessInternet) {
      return false; // Cannot allow internet calls in offline mode
    }
    return true;
  }

  public toSnapshot(): Record<string, unknown> {
    return {
      contextId: this.contextId,
      userId: this.userId,
      projectId: this.projectId,
      documentId: this.documentId,
      evidenceCount: this.retrievedEvidence.length,
      activeMode: this.activeMode,
      language: this.userPreferences.language,
      createdTimestamp: this.createdTimestamp,
    };
  }
}
