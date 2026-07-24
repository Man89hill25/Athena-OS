/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: AI Core Types & Domain Primitives
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp, DeepReadonly } from '../foundation';

/**
 * Task Categories handled by the AI Operating System
 */
export type TaskCategory =
  | 'RESEARCH'
  | 'ACADEMIC_WRITING'
  | 'BIBLE_EXEGESIS'
  | 'PATRISTIC_STUDY'
  | 'CHURCH_HISTORY'
  | 'MANUSCRIPT_ANALYSIS'
  | 'OCR_POST_PROCESS'
  | 'TRANSLATION'
  | 'LINGUISTIC_ANALYSIS'
  | 'KNOWLEDGE_GRAPH'
  | 'CITATION_GENERATION'
  | 'PEER_REVIEW'
  | 'FACT_CHECKING'
  | 'STUDY_PLANNING'
  | 'GENERAL_QUERY';

/**
 * Identifier strings for all 15 specialized agents
 */
export type AgentId =
  | 'ResearchAgent'
  | 'AcademicAgent'
  | 'BibleAgent'
  | 'PatristicAgent'
  | 'ChurchHistoryAgent'
  | 'ManuscriptAgent'
  | 'OCRAgent'
  | 'TranslationAgent'
  | 'LanguageAgent'
  | 'KnowledgeGraphAgent'
  | 'CitationAgent'
  | 'ReviewerAgent'
  | 'FactCheckerAgent'
  | 'StudyPlannerAgent'
  | 'WritingAgent';

/**
 * AI Provider Types supported by abstraction
 */
export type ProviderType = 'gemini' | 'openai' | 'claude' | 'ollama' | 'lmstudio' | 'vllm';

/**
 * Operating Modes for Local/Cloud AI Execution
 */
export type AIExecutionMode = 'offline' | 'hybrid' | 'cloud' | 'emergency';

/**
 * Verification status for academic outputs
 */
export type VerificationStatus = 'VERIFIED' | 'PARTIALLY_VERIFIED' | 'UNVERIFIED' | 'CONTRADICTED';

/**
 * Confidence Levels for AI reasoning
 */
export type ConfidenceLevel = 'VERY_HIGH' | 'HIGH' | 'MEDIUM' | 'LOW' | 'UNVERIFIED';

/**
 * Academic Citation details
 */
export interface CitationInfo {
  readonly id: UUID;
  readonly author: string;
  readonly workTitle: string;
  readonly volume?: string;
  readonly page?: string;
  readonly chapter?: string;
  readonly publisher?: string;
  readonly year?: number;
  readonly uri?: string;
  readonly language?: string;
  readonly originalQuote?: string;
  readonly verificationStatus: VerificationStatus;
}

/**
 * Academic Metadata attached to AI answers
 */
export interface AcademicMetadata {
  readonly sources: ReadonlyArray<string>;
  readonly citations: ReadonlyArray<CitationInfo>;
  readonly footnotes: ReadonlyArray<string>;
  readonly primaryLanguages: ReadonlyArray<string>;
  readonly confidenceScore: number; // 0.0 to 1.0
  readonly academicReliabilityScore: number; // 0.0 to 1.0
  readonly verificationStatus: VerificationStatus;
  readonly historicalPeriod?: string;
  readonly manuscriptRef?: string;
}

/**
 * Granular permissions granted to an Agent
 */
export interface AgentPermissions {
  readonly canAccessInternet: boolean;
  readonly canReadPrivateNotes: boolean;
  readonly canAccessManuscripts: boolean;
  readonly canExecuteCode: boolean;
  readonly maxTokensPerCall: number;
}

/**
 * A single step in an Execution Plan
 */
export interface ExecutionPlanStep {
  readonly stepId: UUID;
  readonly stepNumber: number;
  readonly agentId: AgentId;
  readonly action: string;
  readonly dependencies: ReadonlyArray<UUID>; // Step IDs this step depends on
  readonly status: 'PENDING' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  readonly inputParams: Record<string, unknown>;
  readonly outputResult?: unknown;
  readonly executionTimeMs?: number;
  readonly error?: string;
}

/**
 * Execution Plan created by the Planning Engine
 */
export interface ExecutionPlan {
  readonly planId: UUID;
  readonly goal: string;
  readonly steps: ReadonlyArray<ExecutionPlanStep>;
  readonly estimatedTokens: number;
  readonly priority: 'HIGH' | 'MEDIUM' | 'LOW' | 'BACKGROUND';
  readonly isParallelizable: boolean;
  readonly createdAt: ISO8601Timestamp;
}

/**
 * Token usage stats for telemetry and cost tracking
 */
export interface TokenUsage {
  readonly promptTokens: number;
  readonly completionTokens: number;
  readonly totalTokens: number;
  readonly estimatedCostUsd?: number;
}

/**
 * Agent trace metadata for debugging & transparency
 */
export interface AgentTraceStep {
  readonly stepId: UUID;
  readonly agentId: AgentId;
  readonly startTime: ISO8601Timestamp;
  readonly endTime: ISO8601Timestamp;
  readonly durationMs: number;
  readonly status: 'SUCCESS' | 'FAILURE';
  readonly reasoningExcerpt: string;
}

/**
 * Prompt Template definition
 */
export interface PromptTemplateDefinition {
  readonly id: string;
  readonly name: string;
  readonly version: string;
  readonly template: string;
  readonly variables: ReadonlyArray<string>;
  readonly description: string;
  readonly category: TaskCategory;
  readonly isSystemPrompt: boolean;
}
