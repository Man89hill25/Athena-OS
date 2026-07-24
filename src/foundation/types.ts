/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Global Types & Primitives
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

export type UUID = string;
export type ISO8601Timestamp = string;
export type Nullable<T> = T | null;
export type Optional<T> = T | undefined;
export type DeepReadonly<T> = {
  readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export interface KeyValuePair<K = string, V = unknown> {
  key: K;
  value: V;
}

export interface Disposable {
  dispose(): void | Promise<void>;
}

/**
 * Result Monad for type-safe error handling without exceptions
 */
export class Result<T, E = Error> {
  private constructor(
    private readonly _isSuccess: boolean,
    private readonly _value?: T,
    private readonly _error?: E
  ) {}

  public static ok<T, E = Error>(value: T): Result<T, E> {
    return new Result<T, E>(true, value, undefined);
  }

  public static fail<T, E = Error>(error: E): Result<T, E> {
    return new Result<T, E>(false, undefined, error);
  }

  public get isSuccess(): boolean {
    return this._isSuccess;
  }

  public get isFailure(): boolean {
    return !this._isSuccess;
  }

  public getValue(): T {
    if (!this._isSuccess) {
      throw new Error('Cannot retrieve value from a failed Result instance.');
    }
    return this._value as T;
  }

  public getError(): E {
    if (this._isSuccess) {
      throw new Error('Cannot retrieve error from a successful Result instance.');
    }
    return this._error as E;
  }

  public match<R>(onSuccess: (value: T) => R, onFailure: (error: E) => R): R {
    return this._isSuccess ? onSuccess(this._value as T) : onFailure(this._error as E);
  }
}

/**
 * Either Type
 */
export type Either<L, R> = { kind: 'left'; left: L } | { kind: 'right'; right: R };

export function left<L, R>(value: L): Either<L, R> {
  return { kind: 'left', left: value };
}

export function right<L, R>(value: R): Either<L, R> {
  return { kind: 'right', right: value };
}
