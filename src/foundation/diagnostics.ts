/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Diagnostics & Probes Infrastructure
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { IDiagnosticProbe } from './interfaces';
import { ATHENA_CONSTANTS } from './constants';

export class DiagnosticsManager {
  private probes = new Map<string, IDiagnosticProbe>();

  public registerProbe(probe: IDiagnosticProbe): void {
    this.probes.set(probe.probeName, probe);
  }

  public async runAllDiagnostics(): Promise<Record<string, { passed: boolean; metrics: Record<string, unknown> }>> {
    const results: Record<string, { passed: boolean; metrics: Record<string, unknown> }> = {};

    for (const [name, probe] of this.probes.entries()) {
      try {
        const res = await probe.runDiagnostic();
        results[name] = {
          passed: res.passed,
          metrics: res.metrics,
        };
      } catch (err: any) {
        results[name] = {
          passed: false,
          metrics: { error: err?.message || String(err) },
        };
      }
    }

    return results;
  }

  public getSystemDiagnostics(): {
    memory: { totalAllocatedMb: number; thresholdMb: number; warningPercent: number };
    environment: string;
    nodeVersion: string;
    timestamp: string;
  } {
    const perfMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
    const totalAllocatedMb = perfMemory ? perfMemory.usedJSHeapSize / (1024 * 1024) : 128;
    return {
      memory: {
        totalAllocatedMb: Math.round(totalAllocatedMb * 100) / 100,
        thresholdMb: ATHENA_CONSTANTS.SYSTEM.MAX_MEMORY_MB,
        warningPercent: ATHENA_CONSTANTS.DIAGNOSTICS.MEMORY_THRESHOLD_WARNING_PERCENT,
      },
      environment: process.env.NODE_ENV || 'development',
      nodeVersion: typeof process !== 'undefined' && process.version ? process.version : 'v20.0.0',
      timestamp: new Date().toISOString(),
    };
  }
}

// Global Default System Diagnostic Probes
class MemoryDiagnosticProbe implements IDiagnosticProbe {
  public readonly probeName = 'MemoryProbe';

  public async runDiagnostic(): Promise<{ passed: boolean; metrics: Record<string, number | string | boolean>; timestamp: string }> {
    const perfMemory = (performance as unknown as { memory?: { usedJSHeapSize: number } }).memory;
    const currentMemory = perfMemory ? perfMemory.usedJSHeapSize / (1024 * 1024) : 128;
    const passed = currentMemory < ATHENA_CONSTANTS.SYSTEM.MAX_MEMORY_MB;

    return {
      passed,
      metrics: {
        usedHeapMb: Math.round(currentMemory * 100) / 100,
        maxMemoryLimitMb: ATHENA_CONSTANTS.SYSTEM.MAX_MEMORY_MB,
        status: passed ? 'NORMAL' : 'EXCEEDED',
      },
      timestamp: new Date().toISOString(),
    };
  }
}

export const GlobalDiagnostics = new DiagnosticsManager();
GlobalDiagnostics.registerProbe(new MemoryDiagnosticProbe());
