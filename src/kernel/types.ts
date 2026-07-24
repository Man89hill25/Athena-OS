/**
 * ==========================================================================================================
 * ATHENA X - ATHENA KERNEL
 * Enterprise Runtime Architecture (Directive 202)
 * Core Kernel Interfaces, Types, Enums & Contracts
 * 
 * Version: 3.1.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { ISO8601Timestamp, UUID, Result, ILogger, IConfigProvider, HealthStatus } from '../foundation';

/**
 * Kernel System State Machine Phases
 */
export enum KernelPhase {
  UNINITIALIZED = 'UNINITIALIZED',
  BOOTSTRAPPING = 'BOOTSTRAPPING',
  CONFIGURING = 'CONFIGURING',
  REGISTERING_MODULES = 'REGISTERING_MODULES',
  INITIALIZING_SERVICES = 'INITIALIZING_SERVICES',
  STARTING_WORKERS = 'STARTING_WORKERS',
  READY = 'READY',
  RUNNING = 'RUNNING',
  DEGRADED = 'DEGRADED',
  PAUSED = 'PAUSED',
  STOPPING = 'STOPPING',
  SHUTDOWN = 'SHUTDOWN',
  FAILED = 'FAILED',
}

/**
 * Subsystem Identifiers
 */
export type SubsystemId =
  | 'Bootstrap'
  | 'Runtime'
  | 'Host'
  | 'Application'
  | 'Scheduler'
  | 'Lifecycle'
  | 'DependencyGraph'
  | 'ServiceRegistry'
  | 'ModuleRegistry'
  | 'PluginRuntime'
  | 'WorkerManager'
  | 'ThreadPool'
  | 'EventBus'
  | 'CommandBus'
  | 'QueryBus'
  | 'NotificationBus'
  | 'PipelineEngine'
  | 'MiddlewareEngine'
  | 'WorkflowRuntime'
  | 'ResourceManager'
  | 'MemoryManager'
  | 'ConfigurationRuntime'
  | 'SecurityRuntime'
  | 'PermissionRuntime'
  | 'SandboxRuntime'
  | 'VirtualFileSystem'
  | 'ProcessManager'
  | 'TelemetryRuntime'
  | 'MetricsRuntime'
  | 'HealthRuntime'
  | 'DiagnosticsRuntime'
  | 'RecoveryRuntime'
  | 'ShutdownManager';

/**
 * Subsystem Health Report
 */
export interface SubsystemHealth {
  subsystemId: SubsystemId;
  status: HealthStatus;
  timestamp: ISO8601Timestamp;
  details: Record<string, unknown>;
  latencyMs: number;
}

/**
 * Base Kernel Subsystem Contract
 */
export interface IKernelSubsystem {
  readonly subsystemId: SubsystemId;
  readonly isInitialized: boolean;
  initialize(): Promise<Result<void, Error>>;
  shutdown(): Promise<Result<void, Error>>;
  checkHealth(): Promise<SubsystemHealth>;
}

/**
 * Kernel Configuration Blueprint
 */
export interface KernelConfiguration {
  environment: 'development' | 'staging' | 'production' | 'test';
  nodeId: UUID;
  clusterId: UUID;
  maxMemoryBytes: number;
  maxThreads: number;
  workerPoolSize: number;
  enableTelemetry: boolean;
  enableSandbox: boolean;
  sandboxTimeoutMs: number;
  gracefulShutdownTimeoutMs: number;
  heartbeatIntervalMs: number;
  security: {
    enableAbac: boolean;
    encryptionAlgorithm: string;
    jwtSecret?: string;
  };
  vfs: {
    rootPath: string;
    storageQuotaBytes: number;
  };
}

/**
 * Message Contracts
 */
export interface IKernelMessage<T = unknown> {
  readonly id: UUID;
  readonly type: string;
  readonly timestamp: ISO8601Timestamp;
  readonly source: string;
  readonly payload: T;
  readonly metadata?: Record<string, unknown>;
}

export interface IEvent<T = unknown> extends IKernelMessage<T> {
  readonly category: 'SYSTEM' | 'APPLICATION' | 'AUDIT' | 'SECURITY';
}

export interface ICommand<TPayload = unknown, TResult = unknown> extends IKernelMessage<TPayload> {
  readonly commandName: string;
  readonly expectedResultType?: new (...args: unknown[]) => TResult;
}

export interface IQuery<TPayload = unknown, TResult = unknown> extends IKernelMessage<TPayload> {
  readonly queryName: string;
}

export interface INotification<T = unknown> extends IKernelMessage<T> {
  readonly severity: 'INFO' | 'WARNING' | 'CRITICAL';
}

/**
 * CQRS Handlers
 */
export type CommandHandler<TCommand extends ICommand, TResult> = (
  command: TCommand
) => Promise<Result<TResult, Error>>;

export type QueryHandler<TQuery extends IQuery, TResult> = (
  query: TQuery
) => Promise<Result<TResult, Error>>;

export type EventHandler<TEvent extends IEvent> = (
  event: TEvent
) => Promise<void>;

/**
 * Security & Permissions
 */
export interface UserIdentity {
  id: UUID;
  roles: string[];
  attributes: Record<string, unknown>;
}

export interface PermissionPolicy {
  action: string;
  resource: string;
  conditions?: Record<string, (user: UserIdentity, ctx?: Record<string, unknown>) => boolean>;
}

/**
 * Workflow Sagas
 */
export interface WorkflowStep<TCtx = unknown> {
  name: string;
  execute: (context: TCtx) => Promise<Result<void, Error>>;
  compensate: (context: TCtx) => Promise<void>;
}

export interface WorkflowDefinition<TCtx = unknown> {
  id: string;
  name: string;
  steps: WorkflowStep<TCtx>[];
}

/**
 * Telemetry Span
 */
export interface TelemetrySpan {
  traceId: UUID;
  spanId: UUID;
  parentSpanId?: UUID;
  name: string;
  startTime: ISO8601Timestamp;
  endTime?: ISO8601Timestamp;
  attributes: Record<string, unknown>;
  status: 'OK' | 'ERROR';
}

/**
 * Metrics Data
 */
export interface MetricDataPoint {
  name: string;
  type: 'COUNTER' | 'GAUGE' | 'HISTOGRAM';
  value: number;
  timestamp: ISO8601Timestamp;
  labels: Record<string, string>;
}
