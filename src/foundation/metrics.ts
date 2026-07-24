/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Metrics & Telemetry Infrastructure
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { IMetricsCollector } from './interfaces';

export interface MetricValue {
  name: string;
  type: 'counter' | 'gauge' | 'histogram';
  value: number;
  labels?: Record<string, string>;
  timestamp: string;
}

export class MetricsCollector implements IMetricsCollector {
  private counters = new Map<string, number>();
  private gauges = new Map<string, number>();
  private histograms = new Map<string, number[]>();

  public incrementCounter(name: string, value = 1, labels?: Record<string, string>): void {
    const key = this.buildKey(name, labels);
    const current = this.counters.get(key) || 0;
    this.counters.set(key, current + value);
  }

  public setGauge(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.buildKey(name, labels);
    this.gauges.set(key, value);
  }

  public recordHistogram(name: string, value: number, labels?: Record<string, string>): void {
    const key = this.buildKey(name, labels);
    const list = this.histograms.get(key) || [];
    list.push(value);
    if (list.length > 500) {
      list.shift(); // Keep bounded sliding window
    }
    this.histograms.set(key, list);
  }

  public startTimer(name: string, labels?: Record<string, string>): () => number {
    const startTime = performance.now();
    return () => {
      const elapsedMs = performance.now() - startTime;
      this.recordHistogram(name, elapsedMs, labels);
      return elapsedMs;
    };
  }

  public getSnapshot(): Record<string, unknown> {
    const countersSnapshot: Record<string, number> = {};
    for (const [k, v] of this.counters.entries()) {
      countersSnapshot[k] = v;
    }

    const gaugesSnapshot: Record<string, number> = {};
    for (const [k, v] of this.gauges.entries()) {
      gaugesSnapshot[k] = v;
    }

    const histogramSnapshot: Record<string, { count: number; avg: number; p95: number; p99: number }> = {};
    for (const [k, list] of this.histograms.entries()) {
      if (list.length === 0) continue;
      const sorted = [...list].sort((a, b) => a - b);
      const count = sorted.length;
      const sum = sorted.reduce((acc, curr) => acc + curr, 0);
      const avg = sum / count;
      const p95Idx = Math.floor(count * 0.95);
      const p99Idx = Math.floor(count * 0.99);

      histogramSnapshot[k] = {
        count,
        avg: Math.round(avg * 100) / 100,
        p95: sorted[Math.min(p95Idx, count - 1)],
        p99: sorted[Math.min(p99Idx, count - 1)],
      };
    }

    return {
      timestamp: new Date().toISOString(),
      counters: countersSnapshot,
      gauges: gaugesSnapshot,
      histograms: histogramSnapshot,
    };
  }

  public clear(): void {
    this.counters.clear();
    this.gauges.clear();
    this.histograms.clear();
  }

  private buildKey(name: string, labels?: Record<string, string>): string {
    if (!labels || Object.keys(labels).length === 0) {
      return name;
    }
    const labelStr = Object.entries(labels)
      .map(([k, v]) => `${k}="${v}"`)
      .sort()
      .join(',');
    return `${name}{${labelStr}}`;
  }
}

export const GlobalMetrics = new MetricsCollector();
