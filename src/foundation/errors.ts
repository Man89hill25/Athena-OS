/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Enterprise Error Hierarchy & Taxonomy
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

export enum ErrorSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
  FATAL = 'FATAL',
}

export interface ErrorDetails {
  code: string;
  message: string;
  severity: ErrorSeverity;
  timestamp: string;
  context?: Record<string, unknown>;
  innerError?: Error;
}

export abstract class AthenaError extends Error {
  public readonly code: string;
  public readonly severity: ErrorSeverity;
  public readonly timestamp: string;
  public readonly context?: Record<string, unknown>;
  public readonly innerError?: Error;

  constructor(details: ErrorDetails) {
    super(details.message);
    this.name = this.constructor.name;
    this.code = details.code;
    this.severity = details.severity;
    this.timestamp = details.timestamp || new Date().toISOString();
    this.context = details.context;
    this.innerError = details.innerError;

    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor);
    }
  }

  public toJSON(): Record<string, unknown> {
    return {
      name: this.name,
      code: this.code,
      message: this.message,
      severity: this.severity,
      timestamp: this.timestamp,
      context: this.context,
      stack: this.stack,
      innerError: this.innerError ? this.innerError.message : undefined,
    };
  }
}

export class SystemError extends AthenaError {
  constructor(message: string, code = 'ERR_SYSTEM', context?: Record<string, unknown>, innerError?: Error) {
    super({
      message,
      code,
      severity: ErrorSeverity.CRITICAL,
      timestamp: new Date().toISOString(),
      context,
      innerError,
    });
  }
}

export class DomainError extends AthenaError {
  constructor(message: string, code = 'ERR_DOMAIN', context?: Record<string, unknown>) {
    super({
      message,
      code,
      severity: ErrorSeverity.MEDIUM,
      timestamp: new Date().toISOString(),
      context,
    });
  }
}

export class ConfigurationError extends AthenaError {
  constructor(message: string, code = 'ERR_CONFIG', context?: Record<string, unknown>) {
    super({
      message,
      code,
      severity: ErrorSeverity.HIGH,
      timestamp: new Date().toISOString(),
      context,
    });
  }
}

export class DependencyInjectionError extends AthenaError {
  constructor(message: string, code = 'ERR_DI', context?: Record<string, unknown>) {
    super({
      message,
      code,
      severity: ErrorSeverity.HIGH,
      timestamp: new Date().toISOString(),
      context,
    });
  }
}

export class ValidationError extends AthenaError {
  constructor(message: string, code = 'ERR_VALIDATION', context?: Record<string, unknown>) {
    super({
      message,
      code,
      severity: ErrorSeverity.LOW,
      timestamp: new Date().toISOString(),
      context,
    });
  }
}

export class SecurityError extends AthenaError {
  constructor(message: string, code = 'ERR_SECURITY', context?: Record<string, unknown>) {
    super({
      message,
      code,
      severity: ErrorSeverity.CRITICAL,
      timestamp: new Date().toISOString(),
      context,
    });
  }
}

export class NetworkError extends AthenaError {
  constructor(message: string, code = 'ERR_NETWORK', context?: Record<string, unknown>, innerError?: Error) {
    super({
      message,
      code,
      severity: ErrorSeverity.HIGH,
      timestamp: new Date().toISOString(),
      context,
      innerError,
    });
  }
}

export class StorageError extends AthenaError {
  constructor(message: string, code = 'ERR_STORAGE', context?: Record<string, unknown>, innerError?: Error) {
    super({
      message,
      code,
      severity: ErrorSeverity.HIGH,
      timestamp: new Date().toISOString(),
      context,
      innerError,
    });
  }
}
