/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Structured Logging Infrastructure
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { ILogger, LogLevel } from './interfaces';
import { ATHENA_CONSTANTS } from './constants';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: string;
  context?: Record<string, unknown>;
  error?: {
    name: string;
    message: string;
    stack?: string;
  };
}

export type LogSubscriber = (entry: LogEntry) => void;

const LOG_LEVEL_PRIORITY: Record<LogLevel, number> = {
  TRACE: 10,
  DEBUG: 20,
  INFO: 30,
  WARN: 40,
  ERROR: 50,
  FATAL: 60,
};

export class Logger implements ILogger {
  private static subscribers: Set<LogSubscriber> = new Set();
  private static recentLogs: LogEntry[] = [];

  constructor(
    private readonly name = 'AthenaSystem',
    private minLevel: LogLevel = 'INFO',
    private readonly baseContext: Record<string, unknown> = {}
  ) {}

  public static subscribe(subscriber: LogSubscriber): () => void {
    Logger.subscribers.add(subscriber);
    return () => Logger.subscribers.delete(subscriber);
  }

  public static getRecentLogs(limit = 100): ReadonlyArray<LogEntry> {
    return Logger.recentLogs.slice(-limit);
  }

  public setLevel(level: LogLevel): void {
    this.minLevel = level;
  }

  public trace(message: string, context?: Record<string, unknown>): void {
    this.log('TRACE', message, undefined, context);
  }

  public debug(message: string, context?: Record<string, unknown>): void {
    this.log('DEBUG', message, undefined, context);
  }

  public info(message: string, context?: Record<string, unknown>): void {
    this.log('INFO', message, undefined, context);
  }

  public warn(message: string, context?: Record<string, unknown>): void {
    this.log('WARN', message, undefined, context);
  }

  public error(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log('ERROR', message, error, context);
  }

  public fatal(message: string, error?: Error, context?: Record<string, unknown>): void {
    this.log('FATAL', message, error, context);
  }

  public child(childName: string): ILogger {
    return new Logger(`${this.name}:${childName}`, this.minLevel, { ...this.baseContext });
  }

  private log(level: LogLevel, message: string, error?: Error, context?: Record<string, unknown>): void {
    if (LOG_LEVEL_PRIORITY[level] < LOG_LEVEL_PRIORITY[this.minLevel]) {
      return;
    }

    const mergedContext = this.sanitizeContext({
      loggerName: this.name,
      ...this.baseContext,
      ...context,
    });

    const entry: LogEntry = {
      level,
      message,
      timestamp: new Date().toISOString(),
      context: Object.keys(mergedContext).length > 0 ? mergedContext : undefined,
      error: error
        ? {
            name: error.name,
            message: error.message,
            stack: error.stack,
          }
        : undefined,
    };

    // Buffer store
    Logger.recentLogs.push(entry);
    if (Logger.recentLogs.length > ATHENA_CONSTANTS.LOGGING.MAX_LOG_BUFFER_SIZE) {
      Logger.recentLogs.shift();
    }

    // Console output
    const formatted = `[${entry.timestamp}] [${level}] [${this.name}] ${message}`;
    if (level === 'ERROR' || level === 'FATAL') {
      console.error(formatted, entry.error || '', entry.context || '');
    } else if (level === 'WARN') {
      console.warn(formatted, entry.context || '');
    } else {
      console.log(formatted, entry.context || '');
    }

    // Notify subscribers
    for (const sub of Logger.subscribers) {
      try {
        sub(entry);
      } catch {
        // Ignore subscriber errors to preserve logging stability
      }
    }
  }

  private sanitizeContext(ctx: Record<string, unknown>): Record<string, unknown> {
    const sanitized: Record<string, unknown> = {};
    const maskKeys = ATHENA_CONSTANTS.LOGGING.MASK_KEYS as unknown as string[];

    for (const [key, val] of Object.entries(ctx)) {
      if (maskKeys.some(m => key.toLowerCase().includes(m))) {
        sanitized[key] = '***MASKED***';
      } else {
        sanitized[key] = val;
      }
    }

    return sanitized;
  }
}

export const GlobalLogger = new Logger('GlobalRoot');
