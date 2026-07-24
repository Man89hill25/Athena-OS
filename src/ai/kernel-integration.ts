/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: Kernel Integration Layer
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, ISO8601Timestamp } from '../foundation';
import { EventBus, CommandBus, QueryBus } from '../kernel/event-messaging';
import { IKernelSubsystem, SubsystemId, SubsystemHealth, ICommand, IQuery } from '../kernel/types';
import { AIOrchestrator } from './ai-orchestrator';
import { AIRequest } from './ai-request';
import { AIResponse } from './ai-response';
import { AIContext } from './ai-context';
import { createAIEvent, AIEventTypes } from './ai-events';

export interface ExecuteAIRequestCommandPayload {
  readonly prompt: string;
  readonly userId: string;
  readonly projectId?: string;
}

export interface ExecuteAIRequestCommand extends ICommand<ExecuteAIRequestCommandPayload, AIResponse> {
  readonly commandName: 'ExecuteAIRequestCommand';
}

export interface GetAgentStatusQueryPayload {
  readonly agentId?: string;
}

export interface GetAgentStatusQuery extends IQuery<GetAgentStatusQueryPayload, ReadonlyArray<Record<string, unknown>>> {
  readonly queryName: 'GetAgentStatusQuery';
}

export class AIKernelSubsystem implements IKernelSubsystem {
  public readonly subsystemId: SubsystemId = 'Application';
  private _isInitialized = false;
  private orchestrator: AIOrchestrator;
  private eventBus: EventBus;
  private commandBus: CommandBus;
  private queryBus: QueryBus;

  constructor(eventBus: EventBus, commandBus: CommandBus, queryBus: QueryBus) {
    this.eventBus = eventBus;
    this.commandBus = commandBus;
    this.queryBus = queryBus;
    this.orchestrator = new AIOrchestrator();
  }

  public async initialize(): Promise<Result<void, Error>> {
    if (this._isInitialized) {
      return Result.ok(undefined);
    }

    try {
      // Register Commands
      this.commandBus.registerHandler<ExecuteAIRequestCommand, AIResponse>(
        'ExecuteAIRequestCommand',
        async (cmd) => this.handleExecuteCommand(cmd)
      );

      // Register Queries
      this.queryBus.registerHandler<GetAgentStatusQuery, ReadonlyArray<Record<string, unknown>>>(
        'GetAgentStatusQuery',
        async (query) => this.handleAgentStatusQuery(query)
      );

      this._isInitialized = true;
      return Result.ok(undefined);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public async shutdown(): Promise<Result<void, Error>> {
    this._isInitialized = false;
    return Result.ok(undefined);
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public async checkHealth(): Promise<SubsystemHealth> {
    return {
      subsystemId: this.subsystemId,
      status: 'HEALTHY',
      timestamp: new Date().toISOString() as ISO8601Timestamp,
      details: {
        activeMode: this.orchestrator.getStrategyManager().getCurrentConfig().currentMode,
        providersCount: this.orchestrator.getProviderManager().getAvailableProviders().length,
      },
      latencyMs: 1,
    };
  }

  public getOrchestrator(): AIOrchestrator {
    return this.orchestrator;
  }

  private async handleExecuteCommand(cmd: ExecuteAIRequestCommand): Promise<Result<AIResponse, Error>> {
    const { prompt, userId, projectId } = cmd.payload;

    const context = new AIContext({
      userId,
      projectId,
    });

    const requestRes = AIRequest.create({
      prompt,
      context,
    });

    if (requestRes.isFailure) return Result.fail(requestRes.getError());

    const request = requestRes.getValue();

    // Publish Request Started Event
    await this.eventBus.publish(
      createAIEvent(AIEventTypes.REQUEST_STARTED, {
        requestId: request.requestId,
        promptExcerpt: prompt.slice(0, 100),
        userId,
        activeMode: context.activeMode,
      })
    );

    const orchestrationResult = await this.orchestrator.orchestrate(request);

    if (orchestrationResult.isFailure) {
      await this.eventBus.publish(
        createAIEvent(AIEventTypes.REQUEST_FAILED, {
          requestId: request.requestId,
          errorName: orchestrationResult.getError().name,
          errorMessage: orchestrationResult.getError().message,
        })
      );
      return Result.fail(orchestrationResult.getError());
    }

    const response = orchestrationResult.getValue();

    // Publish Response Generated Event
    await this.eventBus.publish(
      createAIEvent(AIEventTypes.RESPONSE_GENERATED, {
        requestId: request.requestId,
        responseId: response.responseId,
        durationMs: response.timingMs,
        totalTokens: response.tokenUsage.totalTokens,
      })
    );

    // Publish Verification Completed Event
    await this.eventBus.publish(
      createAIEvent(AIEventTypes.VERIFICATION_COMPLETED, {
        requestId: request.requestId,
        responseId: response.responseId,
        verificationStatus: response.academicMetadata.verificationStatus,
        confidenceScore: response.academicMetadata.confidenceScore,
        academicReliabilityScore: response.academicMetadata.academicReliabilityScore,
        citationsCount: response.academicMetadata.citations.length,
      })
    );

    return Result.ok(response);
  }

  private async handleAgentStatusQuery(
    _query: GetAgentStatusQuery
  ): Promise<Result<ReadonlyArray<Record<string, unknown>>, Error>> {
    const providers = this.orchestrator.getProviderManager().getAvailableProviders();
    const statusList = providers.map((p) => ({
      provider: p.name,
      type: p.providerType,
      isLocal: p.isLocal,
      supportedModels: p.supportedModels,
    }));
    return Result.ok(statusList);
  }
}
