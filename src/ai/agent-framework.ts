/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: Agent Framework & Execution Patterns
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, Result } from '../foundation';
import { AgentId, AgentPermissions, CitationInfo } from './ai-types';
import { AIContext } from './ai-context';
import { AgentExecutionError, AgentNotFoundError } from './ai-errors';

export interface AgentResultData {
  readonly textOutput: string;
  readonly citations?: ReadonlyArray<CitationInfo>;
  readonly extraData?: Record<string, unknown>;
}

export interface AgentResult {
  readonly agentId: AgentId;
  readonly success: boolean;
  readonly data?: AgentResultData;
  readonly confidence: number;
  readonly reasoningTrace: string;
  readonly durationMs: number;
  readonly error?: string;
}

export interface AgentContext {
  readonly executionId: UUID;
  readonly globalContext: AIContext;
  readonly sharedMemory: Map<string, unknown>;
  readonly previousStepResults: ReadonlyArray<AgentResult>;
}

export interface FailureRecoveryStrategy {
  readonly maxRetries: number;
  readonly fallbackAgentId?: AgentId;
  readonly allowGracefulDegradation: boolean;
}

export abstract class BaseAgent {
  abstract readonly id: AgentId;
  abstract readonly name: string;
  abstract readonly purpose: string;
  abstract readonly capabilities: ReadonlyArray<string>;
  abstract readonly permissions: AgentPermissions;
  abstract readonly inputSchema: Record<string, unknown>;
  abstract readonly outputSchema: Record<string, unknown>;
  abstract readonly memoryRules: ReadonlyArray<string>;
  abstract readonly collaborationRules: ReadonlyArray<string>;
  abstract readonly failureRecovery: FailureRecoveryStrategy;

  public async execute(
    ctx: AgentContext,
    inputParams: Record<string, unknown>
  ): Promise<Result<AgentResult, AgentExecutionError>> {
    const startTime = Date.now();
    try {
      // Permission check
      if (!ctx.globalContext.validatePermissions(this.permissions)) {
        return Result.fail(
          new AgentExecutionError(this.id, 'Permission validation failed for active execution mode.')
        );
      }

      const outcome = await this.runCoreLogic(ctx, inputParams);
      const durationMs = Date.now() - startTime;

      return Result.ok({
        agentId: this.id,
        success: true,
        data: outcome,
        confidence: outcome.citations && outcome.citations.length > 0 ? 0.95 : 0.85,
        reasoningTrace: `[${this.id}] Successfully completed task. Input keys: ${Object.keys(inputParams).join(', ')}`,
        durationMs,
      });
    } catch (err: unknown) {
      const durationMs = Date.now() - startTime;
      const errorMsg = err instanceof Error ? err.message : String(err);
      return Result.fail(new AgentExecutionError(this.id, errorMsg, { durationMs }));
    }
  }

  protected abstract runCoreLogic(
    ctx: AgentContext,
    inputParams: Record<string, unknown>
  ): Promise<AgentResultData>;
}

export class AgentRegistry {
  private static instance: AgentRegistry;
  private agents: Map<AgentId, BaseAgent> = new Map();

  public static getInstance(): AgentRegistry {
    if (!AgentRegistry.instance) {
      AgentRegistry.instance = new AgentRegistry();
    }
    return AgentRegistry.instance;
  }

  public register(agent: BaseAgent): void {
    this.agents.set(agent.id, agent);
  }

  public getAgent(id: AgentId): Result<BaseAgent, AgentNotFoundError> {
    const agent = this.agents.get(id);
    if (!agent) {
      return Result.fail(new AgentNotFoundError(id));
    }
    return Result.ok(agent);
  }

  public getAllAgents(): ReadonlyArray<BaseAgent> {
    return Array.from(this.agents.values());
  }

  public findByCapability(capability: string): ReadonlyArray<BaseAgent> {
    return this.getAllAgents().filter((a) => a.capabilities.includes(capability));
  }
}

/**
 * Multi-Agent Execution Orchestration Utilities
 */
export class MultiAgentFramework {
  public static async executeSequential(
    agentIds: ReadonlyArray<AgentId>,
    ctx: AgentContext,
    initialInput: Record<string, unknown>
  ): Promise<Result<ReadonlyArray<AgentResult>, Error>> {
    const registry = AgentRegistry.getInstance();
    const results: AgentResult[] = [];
    let currentInput = { ...initialInput };

    for (const agentId of agentIds) {
      const agentRes = registry.getAgent(agentId);
      if (agentRes.isFailure) return Result.fail(agentRes.getError());

      const agent = agentRes.getValue();
      const res = await agent.execute(ctx, currentInput);
      if (res.isFailure) {
        if (!agent.failureRecovery.allowGracefulDegradation) {
          return Result.fail(res.getError());
        }
      } else {
        const val = res.getValue();
        results.push(val);
        if (val.data?.textOutput) {
          currentInput = { ...currentInput, previousOutput: val.data.textOutput };
        }
      }
    }

    return Result.ok(results);
  }

  public static async executeParallel(
    agentIds: ReadonlyArray<AgentId>,
    ctx: AgentContext,
    inputParams: Record<string, unknown>
  ): Promise<Result<ReadonlyArray<AgentResult>, Error>> {
    const registry = AgentRegistry.getInstance();
    const promises = agentIds.map(async (id) => {
      const agentRes = registry.getAgent(id);
      if (agentRes.isFailure) throw agentRes.getError();
      const agent = agentRes.getValue();
      const res = await agent.execute(ctx, inputParams);
      if (res.isFailure) throw res.getError();
      return res.getValue();
    });

    try {
      const results = await Promise.all(promises);
      return Result.ok(results);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public static async executeSupervisorPattern(
    supervisorId: AgentId,
    workerIds: ReadonlyArray<AgentId>,
    ctx: AgentContext,
    taskInput: Record<string, unknown>
  ): Promise<Result<AgentResult, Error>> {
    const registry = AgentRegistry.getInstance();

    // 1. Workers execute in parallel
    const parallelWorkers = await MultiAgentFramework.executeParallel(workerIds, ctx, taskInput);
    if (parallelWorkers.isFailure) return Result.fail(parallelWorkers.getError());

    const workerResults = parallelWorkers.getValue();
    const combinedWorkerOutputs = workerResults.map((r) => `[${r.agentId}]: ${r.data?.textOutput}`).join('\n\n');

    // 2. Supervisor synthesizes and verifies outputs
    const supervisorRes = registry.getAgent(supervisorId);
    if (supervisorRes.isFailure) return Result.fail(supervisorRes.getError());

    const supervisor = supervisorRes.getValue();
    const supervisorOutcome = await supervisor.execute(ctx, {
      taskInput,
      combinedWorkerOutputs,
      workerCount: workerIds.length,
    });

    return supervisorOutcome as Result<AgentResult, Error>;
  }
}
