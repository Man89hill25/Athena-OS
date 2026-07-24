/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: AI Orchestrator & Task Execution Pipeline
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, ISO8601Timestamp } from '../foundation';
import {
  AgentId,
  AgentTraceStep,
  ExecutionPlan,
  ExecutionPlanStep,
  TaskCategory,
  VerificationStatus,
} from './ai-types';
import { AIRequest } from './ai-request';
import { AIResponse } from './ai-response';
import { AgentRegistry, AgentContext, MultiAgentFramework, AgentResult } from './agent-framework';
import { AIProviderManager, AIModelManager } from './ai-providers';
import { LocalAIStrategyManager } from './local-ai-strategy';
import { MemoryEngine } from './memory-engine';
import { AnswerVerifier } from './verification-engine';
import { AIOrchestrationError } from './ai-errors';
import { registerAllSpecializedAgents } from './specialized-agents';

export class TaskClassifier {
  public static classify(promptText: string): {
    category: TaskCategory;
    primaryAgent: AgentId;
    secondaryAgents: ReadonlyArray<AgentId>;
    isParallelizable: boolean;
  } {
    const text = promptText.toLowerCase();

    if (text.includes('آباء') || text.includes('أثناسيوس') || text.includes('باترولوجيا') || text.includes('patristic')) {
      return {
        category: 'PATRISTIC_STUDY',
        primaryAgent: 'PatristicAgent',
        secondaryAgents: ['BibleAgent', 'CitationAgent'],
        isParallelizable: true,
      };
    }

    if (text.includes('ترجمة') || text.includes('ترجم') || text.includes('translate') || text.includes('greek') || text.includes('يوناني')) {
      return {
        category: 'TRANSLATION',
        primaryAgent: 'TranslationAgent',
        secondaryAgents: ['LanguageAgent', 'AcademicAgent'],
        isParallelizable: false,
      };
    }

    if (text.includes('مخطوط') || text.includes('مخطوطة') || text.includes('manuscript') || text.includes('codex')) {
      return {
        category: 'MANUSCRIPT_ANALYSIS',
        primaryAgent: 'ManuscriptAgent',
        secondaryAgents: ['OCRAgent', 'CitationAgent'],
        isParallelizable: true,
      };
    }

    if (text.includes('انجيل') || text.includes('آية') || text.includes('تفسير') || text.includes('bible') || text.includes('exegesis')) {
      return {
        category: 'BIBLE_EXEGESIS',
        primaryAgent: 'BibleAgent',
        secondaryAgents: ['PatristicAgent', 'LanguageAgent', 'CitationAgent'],
        isParallelizable: true,
      };
    }

    if (text.includes('مجمع') || text.includes('تاريخ') || text.includes('history') || text.includes('council')) {
      return {
        category: 'CHURCH_HISTORY',
        primaryAgent: 'ChurchHistoryAgent',
        secondaryAgents: ['PatristicAgent', 'KnowledgeGraphAgent'],
        isParallelizable: true,
      };
    }

    // Default to general academic research
    return {
      category: 'RESEARCH',
      primaryAgent: 'ResearchAgent',
      secondaryAgents: ['AcademicAgent', 'WritingAgent', 'CitationAgent'],
      isParallelizable: true,
    };
  }
}

export class TaskPlanner {
  public static createExecutionPlan(
    goal: string,
    primaryAgent: AgentId,
    secondaryAgents: ReadonlyArray<AgentId>,
    isParallelizable: boolean
  ): ExecutionPlan {
    const planId = crypto.randomUUID();
    const steps: ExecutionPlanStep[] = [];

    // Step 1: Primary agent domain analysis
    const step1Id = crypto.randomUUID();
    steps.push({
      stepId: step1Id,
      stepNumber: 1,
      agentId: primaryAgent,
      action: 'Primary Domain Analysis & Synthesis',
      dependencies: [],
      status: 'PENDING',
      inputParams: { goal },
    });

    // Secondary agent steps
    let previousStepId = step1Id;
    secondaryAgents.forEach((agentId, index) => {
      const stepId = crypto.randomUUID();
      steps.push({
        stepId,
        stepNumber: index + 2,
        agentId,
        action: `Secondary Evaluation - ${agentId}`,
        dependencies: isParallelizable ? [step1Id] : [previousStepId],
        status: 'PENDING',
        inputParams: { goal },
      });
      previousStepId = stepId;
    });

    return {
      planId,
      goal,
      steps,
      estimatedTokens: 2500 * (secondaryAgents.length + 1),
      priority: 'HIGH',
      isParallelizable,
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    };
  }
}

export class AgentRouter {
  public static resolveAgents(
    requestedAgents: ReadonlyArray<AgentId>,
    classifiedPrimary: AgentId,
    classifiedSecondary: ReadonlyArray<AgentId>
  ): { primary: AgentId; secondary: ReadonlyArray<AgentId> } {
    if (requestedAgents.length > 0) {
      return {
        primary: requestedAgents[0],
        secondary: requestedAgents.slice(1),
      };
    }
    return {
      primary: classifiedPrimary,
      secondary: classifiedSecondary,
    };
  }
}

export class ExecutionCoordinator {
  public async executePlan(
    plan: ExecutionPlan,
    agentCtx: AgentContext
  ): Promise<Result<{ trace: ReadonlyArray<AgentTraceStep>; finalOutput: string; citations: Array<any> }, Error>> {
    const trace: AgentTraceStep[] = [];
    const citations: Array<any> = [];
    let cumulativeOutput = '';

    const primaryStep = plan.steps[0];
    const secondarySteps = plan.steps.slice(1);

    // Execute primary agent
    const startTime = Date.now();
    const registry = AgentRegistry.getInstance();
    const primaryAgentRes = registry.getAgent(primaryStep.agentId);
    if (primaryAgentRes.isFailure) return Result.fail(primaryAgentRes.getError());

    const primaryAgent = primaryAgentRes.getValue();
    const primaryOutcome = await primaryAgent.execute(agentCtx, { goal: plan.goal });
    const durationMs = Date.now() - startTime;

    if (primaryOutcome.isFailure) {
      return Result.fail(primaryOutcome.getError());
    }

    const primaryVal = primaryOutcome.getValue();
    cumulativeOutput = primaryVal.data?.textOutput || '';
    if (primaryVal.data?.citations) {
      citations.push(...primaryVal.data.citations);
    }

    trace.push({
      stepId: primaryStep.stepId,
      agentId: primaryStep.agentId,
      startTime: new Date(startTime).toISOString() as ISO8601Timestamp,
      endTime: new Date().toISOString() as ISO8601Timestamp,
      durationMs,
      status: 'SUCCESS',
      reasoningExcerpt: cumulativeOutput.slice(0, 100),
    });

    // Execute secondary agents sequentially or via Supervisor pattern
    if (secondarySteps.length > 0) {
      const secondaryAgentIds = secondarySteps.map((s) => s.agentId);
      const secondaryRes = await MultiAgentFramework.executeSequential(secondaryAgentIds, agentCtx, {
        goal: plan.goal,
        previousOutput: cumulativeOutput,
      });

      if (secondaryRes.isSuccess) {
        for (const res of secondaryRes.getValue()) {
          if (res.data?.textOutput) {
            cumulativeOutput += `\n\n${res.data.textOutput}`;
          }
          if (res.data?.citations) {
            citations.push(...res.data.citations);
          }
          trace.push({
            stepId: crypto.randomUUID(),
            agentId: res.agentId,
            startTime: new Date().toISOString() as ISO8601Timestamp,
            endTime: new Date().toISOString() as ISO8601Timestamp,
            durationMs: res.durationMs,
            status: 'SUCCESS',
            reasoningExcerpt: (res.data?.textOutput || '').slice(0, 100),
          });
        }
      }
    }

    return Result.ok({
      trace,
      finalOutput: cumulativeOutput,
      citations,
    });
  }
}

export class AIOrchestrator {
  private providerManager: AIProviderManager;
  private modelManager: AIModelManager;
  private strategyManager: LocalAIStrategyManager;
  private memoryEngine: MemoryEngine;
  private coordinator: ExecutionCoordinator;

  constructor() {
    registerAllSpecializedAgents();
    this.providerManager = new AIProviderManager();
    this.modelManager = new AIModelManager();
    this.strategyManager = new LocalAIStrategyManager('hybrid');
    this.memoryEngine = new MemoryEngine();
    this.coordinator = new ExecutionCoordinator();
  }

  public async orchestrate(request: AIRequest): Promise<Result<AIResponse, Error>> {
    const startTime = Date.now();

    try {
      // 1. Task Classification
      const classification = TaskClassifier.classify(request.prompt);
      const category = request.taskCategory || classification.category;

      // 2. Agent Selection & Routing
      const agentRouting = AgentRouter.resolveAgents(
        request.requiredAgents,
        classification.primaryAgent,
        classification.secondaryAgents
      );

      // 3. Planning Engine
      const plan = TaskPlanner.createExecutionPlan(
        request.prompt,
        agentRouting.primary,
        agentRouting.secondary,
        classification.isParallelizable
      );

      // 4. Construct Agent Context
      const agentContext: AgentContext = {
        executionId: crypto.randomUUID(),
        globalContext: request.context,
        sharedMemory: new Map<string, unknown>(),
        previousStepResults: [],
      };

      // 5. Execution Coordinator
      const executionResult = await this.coordinator.executePlan(plan, agentContext);
      if (executionResult.isFailure) {
        return Result.fail(new AIOrchestrationError(executionResult.getError().message));
      }

      const execVal = executionResult.getValue();

      // 6. Verification Engine
      const sources = request.context.retrievedEvidence.map((e) => e.sourceUri);
      const academicMetadata = AnswerVerifier.verifyResponse(
        execVal.finalOutput,
        execVal.citations,
        sources.length > 0 ? sources : ['المعجم التراثي والأرشيف الأكاديمي']
      );

      // Store in Memory Engine
      this.memoryEngine.appendConversationTurn(request.context.userId, 'user', request.prompt);
      this.memoryEngine.appendConversationTurn(request.context.userId, 'assistant', execVal.finalOutput);

      const durationMs = Date.now() - startTime;

      // 7. Academic Response Creation
      const response = new AIResponse({
        requestId: request.requestId,
        content: execVal.finalOutput,
        academicMetadata,
        agentTrace: execVal.trace,
        executionPlan: plan,
        tokenUsage: {
          promptTokens: Math.ceil(request.prompt.length / 4),
          completionTokens: Math.ceil(execVal.finalOutput.length / 4),
          totalTokens: Math.ceil((request.prompt.length + execVal.finalOutput.length) / 4),
        },
        timingMs: durationMs,
      });

      return Result.ok(response);
    } catch (err: unknown) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      return Result.fail(new AIOrchestrationError(`Orchestration execution exception: ${errorMsg}`));
    }
  }

  public getProviderManager(): AIProviderManager {
    return this.providerManager;
  }

  public getStrategyManager(): LocalAIStrategyManager {
    return this.strategyManager;
  }

  public getMemoryEngine(): MemoryEngine {
    return this.memoryEngine;
  }
}
