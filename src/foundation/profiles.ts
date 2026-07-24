/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Environment Profiles Configuration
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

export type EnvironmentName = 'development' | 'staging' | 'production' | 'airgapped';

export interface EnvironmentProfile {
  name: EnvironmentName;
  debugMode: boolean;
  enableTelemetry: boolean;
  enableAiStreaming: boolean;
  maxMemoryAllocMb: number;
  apiTimeoutMs: number;
  cacheTtlSeconds: number;
  dbType: 'memory' | 'sqlite' | 'cloudsql';
  allowRemoteStorage: boolean;
}

export const ENVIRONMENT_PROFILES: Record<EnvironmentName, EnvironmentProfile> = {
  development: {
    name: 'development',
    debugMode: true,
    enableTelemetry: false,
    enableAiStreaming: true,
    maxMemoryAllocMb: 2048,
    apiTimeoutMs: 30000,
    cacheTtlSeconds: 300,
    dbType: 'sqlite',
    allowRemoteStorage: true,
  },
  staging: {
    name: 'staging',
    debugMode: true,
    enableTelemetry: true,
    enableAiStreaming: true,
    maxMemoryAllocMb: 4096,
    apiTimeoutMs: 15000,
    cacheTtlSeconds: 1800,
    dbType: 'cloudsql',
    allowRemoteStorage: true,
  },
  production: {
    name: 'production',
    debugMode: false,
    enableTelemetry: true,
    enableAiStreaming: true,
    maxMemoryAllocMb: 8192,
    apiTimeoutMs: 10000,
    cacheTtlSeconds: 3600,
    dbType: 'cloudsql',
    allowRemoteStorage: true,
  },
  airgapped: {
    name: 'airgapped',
    debugMode: false,
    enableTelemetry: false,
    enableAiStreaming: false,
    maxMemoryAllocMb: 8192,
    apiTimeoutMs: 5000,
    cacheTtlSeconds: 7200,
    dbType: 'sqlite',
    allowRemoteStorage: false,
  },
};
