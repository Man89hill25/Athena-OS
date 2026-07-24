/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: AI Application Service API
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { AIOrchestrator } from './ai-orchestrator';
import { AIRequest } from './ai-request';
import { AIResponse } from './ai-response';
import { AIContext } from './ai-context';
import { AIExecutionMode, AgentId } from './ai-types';

export interface ExecuteQueryOptions {
  readonly projectId?: UUID;
  readonly documentId?: UUID;
  readonly activeMode?: AIExecutionMode;
  readonly requiredAgents?: ReadonlyArray<AgentId>;
}

export class AIApplicationService {
  private orchestrator: AIOrchestrator;

  constructor(orchestrator?: AIOrchestrator) {
    this.orchestrator = orchestrator || new AIOrchestrator();
  }

  public async executeAcademicQuery(
    prompt: string,
    userId: UUID,
    options?: ExecuteQueryOptions
  ): Promise<Result<AIResponse, Error>> {
    const context = new AIContext({
      userId,
      projectId: options?.projectId,
      documentId: options?.documentId,
      activeMode: options?.activeMode,
    });

    const requestRes = AIRequest.create({
      prompt,
      context,
      requiredAgents: options?.requiredAgents,
    });

    if (requestRes.isFailure) {
      return Result.fail(requestRes.getError());
    }

    return this.orchestrator.orchestrate(requestRes.getValue());
  }

  public async analyzeManuscript(
    manuscriptId: string,
    folioNumber: string,
    userId: UUID
  ): Promise<Result<AIResponse, Error>> {
    const prompt = `قم بإجراء تحليل حشوي وبليوجرافي تفصيلي للمخطوطة رقم (${manuscriptId})، المجلد/الورقة (${folioNumber}).`;
    return this.executeAcademicQuery(prompt, userId, {
      requiredAgents: ['ManuscriptAgent', 'OCRAgent', 'CitationAgent'],
    });
  }

  public async verifyCitations(
    citationsText: string,
    userId: UUID
  ): Promise<Result<AIResponse, Error>> {
    const prompt = `قم بالتحقق الأكاديمي والمنهجي من صحة ودقة الاستشهادات والمراجع التالية:\n${citationsText}`;
    return this.executeAcademicQuery(prompt, userId, {
      requiredAgents: ['CitationAgent', 'FactCheckerAgent'],
    });
  }

  public async generateResearchPlan(
    topic: string,
    timeframeDays: number,
    userId: UUID
  ): Promise<Result<AIResponse, Error>> {
    const prompt = `أنشئ خطة بحثية ودراسية شاملة لموضوع: "${topic}" في مدة زمنية قدرها ${timeframeDays} يوماً.`;
    return this.executeAcademicQuery(prompt, userId, {
      requiredAgents: ['StudyPlannerAgent', 'ResearchAgent', 'WritingAgent'],
    });
  }

  public getSystemStatus(): Record<string, unknown> {
    const strategyConfig = this.orchestrator.getStrategyManager().getCurrentConfig();
    const providers = this.orchestrator.getProviderManager().getAvailableProviders();

    return {
      activeMode: strategyConfig.currentMode,
      isNetworkAvailable: strategyConfig.isNetworkAvailable,
      localModelsReady: strategyConfig.localModelsReady,
      registeredProvidersCount: providers.length,
      availableProviders: providers.map((p) => ({
        name: p.name,
        type: p.providerType,
        isLocal: p.isLocal,
      })),
    };
  }

  public setOperatingMode(mode: AIExecutionMode): void {
    this.orchestrator.getStrategyManager().setMode(mode);
  }
}
