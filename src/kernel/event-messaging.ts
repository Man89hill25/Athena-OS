/**
 * ==========================================================================================================
 * ATHENA X - ATHENA KERNEL
 * Subsystems: EventBus, CommandBus, QueryBus, NotificationBus
 * 
 * Version: 3.1.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, ISO8601Timestamp } from '../foundation';
import {
  IKernelSubsystem,
  SubsystemId,
  SubsystemHealth,
  IEvent,
  ICommand,
  IQuery,
  INotification,
  EventHandler,
  CommandHandler,
  QueryHandler,
} from './types';

/**
 * ==========================================================================================================
 * 1. EVENT BUS SUBSYSTEM
 * Reactive Typed Event Messaging Engine
 * ==========================================================================================================
 */
export class EventBus implements IKernelSubsystem {
  public readonly subsystemId: SubsystemId = 'EventBus';
  private _isInitialized = false;
  private handlers: Map<string, EventHandler<IEvent<unknown>>[]> = new Map();
  private eventHistory: IEvent<unknown>[] = [];
  private maxHistorySize = 1000;

  public async initialize(): Promise<Result<void, Error>> {
    this._isInitialized = true;
    return Result.ok(undefined);
  }

  public async shutdown(): Promise<Result<void, Error>> {
    this.handlers.clear();
    this.eventHistory = [];
    this._isInitialized = false;
    return Result.ok(undefined);
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public async checkHealth(): Promise<SubsystemHealth> {
    return {
      subsystemId: this.subsystemId,
      status: 'HEALTHY',
      timestamp: new Date().toISOString() as ISO8601Timestamp,
      details: {
        activeEventTopics: this.handlers.size,
        historyCount: this.eventHistory.length,
      },
      latencyMs: 1,
    };
  }

  public subscribe<TEvent extends IEvent<unknown>>(
    eventType: string,
    handler: EventHandler<TEvent>
  ): () => void {
    if (!this.handlers.has(eventType)) {
      this.handlers.set(eventType, []);
    }
    const topicHandlers = this.handlers.get(eventType)!;
    topicHandlers.push(handler as EventHandler<IEvent<unknown>>);

    return () => {
      const idx = topicHandlers.indexOf(handler as EventHandler<IEvent<unknown>>);
      if (idx !== -1) {
        topicHandlers.splice(idx, 1);
      }
    };
  }

  public async publish<TEvent extends IEvent<unknown>>(event: TEvent): Promise<void> {
    this.eventHistory.push(event as IEvent<unknown>);
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    const topicHandlers = this.handlers.get(event.type) || [];
    const wildcardHandlers = this.handlers.get('*') || [];

    const allHandlers = [...topicHandlers, ...wildcardHandlers];
    await Promise.all(allHandlers.map((handler) => handler(event)));
  }

  public getHistory(): ReadonlyArray<IEvent<unknown>> {
    return this.eventHistory;
  }
}

/**
 * ==========================================================================================================
 * 2. COMMAND BUS SUBSYSTEM
 * CQRS Command Dispatcher with Interceptor Support
 * ==========================================================================================================
 */
export class CommandBus implements IKernelSubsystem {
  public readonly subsystemId: SubsystemId = 'CommandBus';
  private _isInitialized = false;
  private handlers: Map<string, CommandHandler<ICommand, unknown>> = new Map();
  private middlewares: Array<(cmd: ICommand, next: () => Promise<Result<unknown, Error>>) => Promise<Result<unknown, Error>>> = [];

  public async initialize(): Promise<Result<void, Error>> {
    this._isInitialized = true;
    return Result.ok(undefined);
  }

  public async shutdown(): Promise<Result<void, Error>> {
    this.handlers.clear();
    this.middlewares = [];
    this._isInitialized = false;
    return Result.ok(undefined);
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public async checkHealth(): Promise<SubsystemHealth> {
    return {
      subsystemId: this.subsystemId,
      status: 'HEALTHY',
      timestamp: new Date().toISOString() as ISO8601Timestamp,
      details: { registeredCommands: this.handlers.size },
      latencyMs: 1,
    };
  }

  public registerHandler<TCmd extends ICommand, TResult>(
    commandName: string,
    handler: CommandHandler<TCmd, TResult>
  ): void {
    if (this.handlers.has(commandName)) {
      throw new Error(`Command '${commandName}' already has a registered handler.`);
    }
    this.handlers.set(commandName, handler as CommandHandler<ICommand, unknown>);
  }

  public useMiddleware(
    middleware: (cmd: ICommand, next: () => Promise<Result<unknown, Error>>) => Promise<Result<unknown, Error>>
  ): void {
    this.middlewares.push(middleware);
  }

  public async dispatch<TCmd extends ICommand, TResult>(
    command: TCmd
  ): Promise<Result<TResult, Error>> {
    const handler = this.handlers.get(command.commandName);
    if (!handler) {
      return Result.fail(new Error(`No CommandHandler registered for '${command.commandName}'.`));
    }

    const executeCore = async (): Promise<Result<unknown, Error>> => {
      return handler(command);
    };

    let index = -1;
    const dispatchMiddleware = async (i: number): Promise<Result<unknown, Error>> => {
      if (i <= index) throw new Error('next() called multiple times');
      index = i;
      const mw = this.middlewares[i];
      if (mw) {
        return mw(command, () => dispatchMiddleware(i + 1));
      } else {
        return executeCore();
      }
    };

    return dispatchMiddleware(0) as Promise<Result<TResult, Error>>;
  }
}

/**
 * ==========================================================================================================
 * 3. QUERY BUS SUBSYSTEM
 * CQRS Query Dispatcher with Query Caching Support
 * ==========================================================================================================
 */
export class QueryBus implements IKernelSubsystem {
  public readonly subsystemId: SubsystemId = 'QueryBus';
  private _isInitialized = false;
  private handlers: Map<string, QueryHandler<IQuery, unknown>> = new Map();
  private cache: Map<string, { value: unknown; expiresAt: number }> = new Map();

  public async initialize(): Promise<Result<void, Error>> {
    this._isInitialized = true;
    return Result.ok(undefined);
  }

  public async shutdown(): Promise<Result<void, Error>> {
    this.handlers.clear();
    this.cache.clear();
    this._isInitialized = false;
    return Result.ok(undefined);
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public async checkHealth(): Promise<SubsystemHealth> {
    return {
      subsystemId: this.subsystemId,
      status: 'HEALTHY',
      timestamp: new Date().toISOString() as ISO8601Timestamp,
      details: {
        registeredQueries: this.handlers.size,
        cacheSize: this.cache.size,
      },
      latencyMs: 1,
    };
  }

  public registerHandler<TQuery extends IQuery, TResult>(
    queryName: string,
    handler: QueryHandler<TQuery, TResult>
  ): void {
    if (this.handlers.has(queryName)) {
      throw new Error(`Query '${queryName}' already has a registered handler.`);
    }
    this.handlers.set(queryName, handler as QueryHandler<IQuery, unknown>);
  }

  public async ask<TQuery extends IQuery, TResult>(
    query: TQuery,
    cacheTtlMs = 0
  ): Promise<Result<TResult, Error>> {
    const cacheKey = `${query.queryName}:${JSON.stringify(query.payload)}`;

    if (cacheTtlMs > 0 && this.cache.has(cacheKey)) {
      const cached = this.cache.get(cacheKey)!;
      if (Date.now() < cached.expiresAt) {
        return Result.ok(cached.value as TResult);
      } else {
        this.cache.delete(cacheKey);
      }
    }

    const handler = this.handlers.get(query.queryName);
    if (!handler) {
      return Result.fail(new Error(`No QueryHandler registered for '${query.queryName}'.`));
    }

    const result = await handler(query);
    if (result.isSuccess && cacheTtlMs > 0) {
      this.cache.set(cacheKey, {
        value: result.getValue(),
        expiresAt: Date.now() + cacheTtlMs,
      });
    }

    return result as Result<TResult, Error>;
  }

  public clearCache(): void {
    this.cache.clear();
  }
}

/**
 * ==========================================================================================================
 * 4. NOTIFICATION BUS SUBSYSTEM
 * PubSub Broadcast & Severity Channel Dispatcher
 * ==========================================================================================================
 */
export class NotificationBus implements IKernelSubsystem {
  public readonly subsystemId: SubsystemId = 'NotificationBus';
  private _isInitialized = false;
  private channelSubscribers: Map<string, Array<(notification: INotification) => void>> = new Map();

  public async initialize(): Promise<Result<void, Error>> {
    this._isInitialized = true;
    return Result.ok(undefined);
  }

  public async shutdown(): Promise<Result<void, Error>> {
    this.channelSubscribers.clear();
    this._isInitialized = false;
    return Result.ok(undefined);
  }

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public async checkHealth(): Promise<SubsystemHealth> {
    return {
      subsystemId: this.subsystemId,
      status: 'HEALTHY',
      timestamp: new Date().toISOString() as ISO8601Timestamp,
      details: { activeChannels: this.channelSubscribers.size },
      latencyMs: 1,
    };
  }

  public subscribeChannel(
    channel: string,
    callback: (notification: INotification) => void
  ): () => void {
    if (!this.channelSubscribers.has(channel)) {
      this.channelSubscribers.set(channel, []);
    }
    const subs = this.channelSubscribers.get(channel)!;
    subs.push(callback);

    return () => {
      const idx = subs.indexOf(callback);
      if (idx !== -1) subs.splice(idx, 1);
    };
  }

  public broadcast(channel: string, notification: INotification): void {
    const subs = this.channelSubscribers.get(channel) || [];
    const globalSubs = this.channelSubscribers.get('*') || [];
    const all = [...subs, ...globalSubs];
    for (const sub of all) {
      try {
        sub(notification);
      } catch (err) {
        // Silently capture broadcast listener errors
      }
    }
  }
}
