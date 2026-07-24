/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Health Monitoring Infrastructure
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { HealthCheckResult, HealthStatus, IHealthCheckable } from './interfaces';

export interface ComprehensiveHealthReport {
  overallStatus: HealthStatus;
  timestamp: string;
  totalSubsystems: number;
  healthyCount: number;
  degradedCount: number;
  unhealthyCount: number;
  subsystemReports: HealthCheckResult[];
}

export class HealthMonitor {
  private subsystems = new Map<string, IHealthCheckable>();

  public registerSubsystem(subsystem: IHealthCheckable): void {
    this.subsystems.set(subsystem.subsystemName, subsystem);
  }

  public unregisterSubsystem(subsystemName: string): void {
    this.subsystems.delete(subsystemName);
  }

  public async evaluateHealth(): Promise<ComprehensiveHealthReport> {
    const reports: HealthCheckResult[] = [];
    const timestamp = new Date().toISOString();

    for (const subsystem of this.subsystems.values()) {
      const startTime = performance.now();
      try {
        const result = await subsystem.checkHealth();
        reports.push(result);
      } catch (err: any) {
        reports.push({
          subsystemName: subsystem.subsystemName,
          status: 'UNHEALTHY',
          checkTimestamp: timestamp,
          latencyMs: performance.now() - startTime,
          details: { error: err?.message || String(err) },
        });
      }
    }

    let healthyCount = 0;
    let degradedCount = 0;
    let unhealthyCount = 0;

    for (const r of reports) {
      if (r.status === 'HEALTHY') healthyCount++;
      else if (r.status === 'DEGRADED') degradedCount++;
      else unhealthyCount++;
    }

    let overallStatus: HealthStatus = 'HEALTHY';
    if (unhealthyCount > 0) {
      overallStatus = 'UNHEALTHY';
    } else if (degradedCount > 0) {
      overallStatus = 'DEGRADED';
    }

    return {
      overallStatus,
      timestamp,
      totalSubsystems: reports.length,
      healthyCount,
      degradedCount,
      unhealthyCount,
      subsystemReports: reports,
    };
  }
}

export const GlobalHealthMonitor = new HealthMonitor();
