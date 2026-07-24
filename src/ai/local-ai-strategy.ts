/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: Local AI Strategy Manager
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { AIExecutionMode, ProviderType } from './ai-types';
import { OfflineModeRestrictionError } from './ai-errors';

export interface AIStrategyConfig {
  readonly currentMode: AIExecutionMode;
  readonly isNetworkAvailable: boolean;
  readonly localModelsReady: boolean;
  readonly batteryLevelPercent?: number;
}

export interface IAIStrategy {
  readonly mode: AIExecutionMode;
  selectProvider(isComplexTask: boolean): Result<ProviderType, Error>;
  canAccessInternet(): boolean;
}

export class OfflineStrategy implements IAIStrategy {
  readonly mode: AIExecutionMode = 'offline';

  selectProvider(_isComplexTask: boolean): Result<ProviderType, Error> {
    // Offline mode strictly uses local providers
    return Result.ok('ollama');
  }

  canAccessInternet(): boolean {
    return false;
  }
}

export class HybridStrategy implements IAIStrategy {
  readonly mode: AIExecutionMode = 'hybrid';

  selectProvider(isComplexTask: boolean): Result<ProviderType, Error> {
    if (isComplexTask) {
      return Result.ok('gemini'); // Delegate complex tasks to cloud
    }
    return Result.ok('ollama'); // Fast tasks locally
  }

  canAccessInternet(): boolean {
    return true;
  }
}

export class CloudStrategy implements IAIStrategy {
  readonly mode: AIExecutionMode = 'cloud';

  selectProvider(_isComplexTask: boolean): Result<ProviderType, Error> {
    return Result.ok('gemini');
  }

  canAccessInternet(): boolean {
    return true;
  }
}

export class EmergencyStrategy implements IAIStrategy {
  readonly mode: AIExecutionMode = 'emergency';

  selectProvider(_isComplexTask: boolean): Result<ProviderType, Error> {
    // Lightweight local fallback mode
    return Result.ok('lmstudio');
  }

  canAccessInternet(): boolean {
    return false;
  }
}

export class LocalAIStrategyManager {
  private currentConfig: AIStrategyConfig;
  private strategies: Map<AIExecutionMode, IAIStrategy> = new Map();

  constructor(initialMode: AIExecutionMode = 'hybrid') {
    this.currentConfig = {
      currentMode: initialMode,
      isNetworkAvailable: true,
      localModelsReady: true,
    };

    this.strategies.set('offline', new OfflineStrategy());
    this.strategies.set('hybrid', new HybridStrategy());
    this.strategies.set('cloud', new CloudStrategy());
    this.strategies.set('emergency', new EmergencyStrategy());
  }

  public setMode(mode: AIExecutionMode): void {
    this.currentConfig = {
      ...this.currentConfig,
      currentMode: mode,
    };
  }

  public updateNetworkStatus(isOnline: boolean): void {
    let mode = this.currentConfig.currentMode;
    if (!isOnline && (mode === 'cloud' || mode === 'hybrid')) {
      mode = 'offline'; // Auto degradation
    }
    this.currentConfig = {
      ...this.currentConfig,
      isNetworkAvailable: isOnline,
      currentMode: mode,
    };
  }

  public getActiveStrategy(): IAIStrategy {
    return this.strategies.get(this.currentConfig.currentMode) || this.strategies.get('offline')!;
  }

  public getCurrentConfig(): AIStrategyConfig {
    return { ...this.currentConfig };
  }

  public validateFeatureExecution(featureName: string, requiresInternet: boolean): Result<void, Error> {
    const strategy = this.getActiveStrategy();
    if (requiresInternet && !strategy.canAccessInternet()) {
      return Result.fail(new OfflineModeRestrictionError(featureName));
    }
    return Result.ok(undefined);
  }
}
