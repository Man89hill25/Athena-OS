/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: AI Request Engine
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp, Result } from '../foundation';
import { TaskCategory, AgentId, AIExecutionMode } from './ai-types';
import { AIContext } from './ai-context';
import { AIValidationError } from './ai-errors';

export interface AIRequestAcademicRequirements {
  readonly requireCitations: boolean;
  readonly minSourcesCount: number;
  readonly verifyFactClaims: boolean;
  readonly allowedLanguages: ReadonlyArray<string>;
  readonly strictManuscriptMatching: boolean;
}

export interface AIRequestParams {
  readonly requestId?: UUID;
  readonly prompt: string;
  readonly context: AIContext;
  readonly taskCategory?: TaskCategory;
  readonly preferredMode?: AIExecutionMode;
  readonly requiredAgents?: ReadonlyArray<AgentId>;
  readonly academicRequirements?: AIRequestAcademicRequirements;
  readonly timestamp?: ISO8601Timestamp;
}

/**
 * Immutable Representation of an Incoming AI Task Request
 */
export class AIRequest {
  public readonly requestId: UUID;
  public readonly prompt: string;
  public readonly context: AIContext;
  public readonly taskCategory?: TaskCategory;
  public readonly preferredMode: AIExecutionMode;
  public readonly requiredAgents: ReadonlyArray<AgentId>;
  public readonly academicRequirements: AIRequestAcademicRequirements;
  public readonly timestamp: ISO8601Timestamp;

  private constructor(params: AIRequestParams) {
    this.requestId = params.requestId || crypto.randomUUID();
    this.prompt = params.prompt;
    this.context = params.context;
    this.taskCategory = params.taskCategory;
    this.preferredMode = params.preferredMode || params.context.activeMode;
    this.requiredAgents = params.requiredAgents ? [...params.requiredAgents] : [];
    this.academicRequirements = params.academicRequirements || {
      requireCitations: true,
      minSourcesCount: 1,
      verifyFactClaims: true,
      allowedLanguages: ['ar', 'en', 'grc', 'la'],
      strictManuscriptMatching: false,
    };
    this.timestamp = params.timestamp || (new Date().toISOString() as ISO8601Timestamp);

    Object.freeze(this.requiredAgents);
    Object.freeze(this.academicRequirements);
    Object.freeze(this);
  }

  public static create(params: AIRequestParams): Result<AIRequest, AIValidationError> {
    if (!params.prompt || params.prompt.trim().length === 0) {
      return Result.fail(new AIValidationError('Prompt text cannot be empty or blank.'));
    }

    if (!params.context) {
      return Result.fail(new AIValidationError('AI Context is required to construct an AIRequest.'));
    }

    return Result.ok(new AIRequest(params));
  }

  public withTaskCategory(category: TaskCategory): AIRequest {
    return new AIRequest({
      requestId: this.requestId,
      prompt: this.prompt,
      context: this.context,
      taskCategory: category,
      preferredMode: this.preferredMode,
      requiredAgents: this.requiredAgents,
      academicRequirements: this.academicRequirements,
      timestamp: this.timestamp,
    });
  }

  public withRequiredAgents(agents: ReadonlyArray<AgentId>): AIRequest {
    return new AIRequest({
      requestId: this.requestId,
      prompt: this.prompt,
      context: this.context,
      taskCategory: this.taskCategory,
      preferredMode: this.preferredMode,
      requiredAgents: agents,
      academicRequirements: this.academicRequirements,
      timestamp: this.timestamp,
    });
  }
}
