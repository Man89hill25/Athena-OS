/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: AI Events Definition
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { ISO8601Timestamp, UUID } from '../foundation';
import { IEvent } from '../kernel/types';
import { AgentId, TaskCategory, VerificationStatus } from './ai-types';

export interface AIRequestStartedPayload {
  readonly requestId: UUID;
  readonly promptExcerpt: string;
  readonly userId: UUID;
  readonly activeMode: string;
}

export interface TaskClassifiedPayload {
  readonly requestId: UUID;
  readonly taskCategory: TaskCategory;
  readonly recommendedAgents: ReadonlyArray<AgentId>;
  readonly isParallelizable: boolean;
}

export interface PlanCreatedPayload {
  readonly requestId: UUID;
  readonly planId: UUID;
  readonly stepsCount: number;
  readonly estimatedTokens: number;
}

export interface AgentActivatedPayload {
  readonly requestId: UUID;
  readonly agentId: AgentId;
  readonly stepId: UUID;
  readonly action: string;
}

export interface AgentCompletedPayload {
  readonly requestId: UUID;
  readonly agentId: AgentId;
  readonly stepId: UUID;
  readonly durationMs: number;
  readonly success: boolean;
}

export interface ResponseGeneratedPayload {
  readonly requestId: UUID;
  readonly responseId: UUID;
  readonly durationMs: number;
  readonly totalTokens: number;
}

export interface VerificationCompletedPayload {
  readonly requestId: UUID;
  readonly responseId: UUID;
  readonly verificationStatus: VerificationStatus;
  readonly confidenceScore: number;
  readonly academicReliabilityScore: number;
  readonly citationsCount: number;
}

export interface AIRequestFailedPayload {
  readonly requestId: UUID;
  readonly errorName: string;
  readonly errorMessage: string;
}

export function createAIEvent<T>(
  type: string,
  payload: T,
  source = 'AIOrchestrator'
): IEvent<T> {
  return {
    id: crypto.randomUUID(),
    type,
    category: 'APPLICATION',
    source,
    timestamp: new Date().toISOString() as ISO8601Timestamp,
    payload,
  };
}

export const AIEventTypes = {
  REQUEST_STARTED: 'ai:request_started',
  TASK_CLASSIFIED: 'ai:task_classified',
  PLAN_CREATED: 'ai:plan_created',
  AGENT_ACTIVATED: 'ai:agent_activated',
  AGENT_COMPLETED: 'ai:agent_completed',
  RESPONSE_GENERATED: 'ai:response_generated',
  VERIFICATION_COMPLETED: 'ai:verification_completed',
  REQUEST_FAILED: 'ai:request_failed',
} as const;
