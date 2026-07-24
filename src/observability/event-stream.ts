/**
 * ==========================================================================================================
 * ATHENA X - OBSERVABILITY PLATFORM
 * Module: Live Reactive Telemetry Event Stream Processor
 * 
 * Directive: DIRECTIVE 222 — ATHENA X OBSERVABILITY PLATFORM v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export interface TelemetryStreamEvent {
  readonly eventId: string;
  readonly category: 'log' | 'trace' | 'metric' | 'alert';
  readonly payload: unknown;
  readonly timestampISO: string;
}

export class EventStreamProcessor {
  private subscribers: Array<(event: TelemetryStreamEvent) => void> = [];

  public subscribe(callback: (event: TelemetryStreamEvent) => void): () => void {
    this.subscribers.push(callback);
    return () => {
      this.subscribers = this.subscribers.filter(sub => sub !== callback);
    };
  }

  public publishEvent(category: 'log' | 'trace' | 'metric' | 'alert', payload: unknown): Result<void, Error> {
    try {
      const streamEvent: TelemetryStreamEvent = {
        eventId: `evt-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        category,
        payload,
        timestampISO: new Date().toISOString()
      };
      this.subscribers.forEach(sub => sub(streamEvent));
      return Result.ok(undefined);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
