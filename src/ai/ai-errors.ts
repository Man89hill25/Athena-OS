/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: AI Domain Errors
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { DomainError } from '../foundation';

export class AIError extends DomainError {
  constructor(message: string, code = 'AI_GENERIC_ERROR', details?: Record<string, unknown>) {
    super(message, code, details);
    this.name = 'AIError';
  }
}

export class AIOrchestrationError extends AIError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'AI_ORCHESTRATION_FAILED', details);
    this.name = 'AIOrchestrationError';
  }
}

export class AIValidationError extends AIError {
  constructor(message: string, details?: Record<string, unknown>) {
    super(message, 'AI_VALIDATION_FAILED', details);
    this.name = 'AIValidationError';
  }
}

export class AgentNotFoundError extends AIError {
  constructor(agentId: string) {
    super(`Agent '${agentId}' was not found in AgentRegistry.`, 'AGENT_NOT_FOUND', { agentId });
    this.name = 'AgentNotFoundError';
  }
}

export class AgentExecutionError extends AIError {
  constructor(agentId: string, cause: string, details?: Record<string, unknown>) {
    super(`Agent '${agentId}' failed during execution: ${cause}`, 'AGENT_EXECUTION_FAILED', {
      agentId,
      cause,
      ...details,
    });
    this.name = 'AgentExecutionError';
  }
}

export class ProviderUnavailableError extends AIError {
  constructor(providerType: string, reason: string) {
    super(`AI Provider '${providerType}' is unavailable: ${reason}`, 'PROVIDER_UNAVAILABLE', {
      providerType,
      reason,
    });
    this.name = 'ProviderUnavailableError';
  }
}

export class PromptInjectionError extends AIError {
  constructor(detectedPattern: string) {
    super(`Prompt injection or unsafe content pattern detected: ${detectedPattern}`, 'PROMPT_INJECTION_DETECTED', {
      detectedPattern,
    });
    this.name = 'PromptInjectionError';
  }
}

export class ContextOverflowError extends AIError {
  constructor(currentTokens: number, maxAllowedTokens: number) {
    super(
      `Context window overflow. Token count (${currentTokens}) exceeds limit (${maxAllowedTokens}).`,
      'CONTEXT_OVERFLOW',
      { currentTokens, maxAllowedTokens }
    );
    this.name = 'ContextOverflowError';
  }
}

export class VerificationFailedError extends AIError {
  constructor(reason: string, details?: Record<string, unknown>) {
    super(`Academic response verification failed: ${reason}`, 'VERIFICATION_FAILED', details);
    this.name = 'VerificationFailedError';
  }
}

export class OfflineModeRestrictionError extends AIError {
  constructor(requestedFeature: string) {
    super(
      `Operation '${requestedFeature}' cannot be completed in offline mode without local model support.`,
      'OFFLINE_RESTRICTION',
      { requestedFeature }
    );
    this.name = 'OfflineModeRestrictionError';
  }
}
