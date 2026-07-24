/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Base Core Interfaces
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { ISO8601Timestamp } from './types';

export interface IService {
  readonly serviceName: string;
  readonly isInitialized: boolean;
  initialize(): Promise<void>;
  shutdown(): Promise<void>;
}

export interface IModule {
  readonly moduleId: string;
  readonly moduleName: string;
  readonly version: string;
  registerServices(): void;
}

export type LogLevel = 'TRACE' | 'DEBUG' | 'INFO' | 'WARN' | 'ERROR' | 'FATAL';

export interface ILogger {
  trace(message: string, context?: Record<string, unknown>): void;
  debug(message: string, context?: Record<string, unknown>): void;
  info(message: string, context?: Record<string, unknown>): void;
  warn(message: string, context?: Record<string, unknown>): void;
  error(message: string, error?: Error, context?: Record<string, unknown>): void;
  fatal(message: string, error?: Error, context?: Record<string, unknown>): void;
  child(childName: string): ILogger;
}

export interface IConfigProvider {
  get<T>(key: string, defaultValue?: T): T;
  has(key: string): boolean;
  getAll(): Record<string, unknown>;
  freeze(): void;
}

export type HealthStatus = 'HEALTHY' | 'DEGRADED' | 'UNHEALTHY';

export interface HealthCheckResult {
  subsystemName: string;
  status: HealthStatus;
  checkTimestamp: ISO8601Timestamp;
  latencyMs: number;
  details?: Record<string, unknown>;
}

export interface IHealthCheckable {
  readonly subsystemName: string;
  checkHealth(): Promise<HealthCheckResult>;
}

export interface IDiagnosticProbe {
  readonly probeName: string;
  runDiagnostic(): Promise<{
    passed: boolean;
    metrics: Record<string, number | string | boolean>;
    timestamp: ISO8601Timestamp;
  }>;
}

export interface IMetricsCollector {
  incrementCounter(name: string, value?: number, labels?: Record<string, string>): void;
  setGauge(name: string, value: number, labels?: Record<string, string>): void;
  recordHistogram(name: string, value: number, labels?: Record<string, string>): void;
  startTimer(name: string, labels?: Record<string, string>): () => number;
  getSnapshot(): Record<string, unknown>;
}
