/**
 * ==========================================================================================================
 * ATHENA X - FOUNDATION LAYER
 * Core Abstract Base Classes
 * 
 * Directive: 201 (Foundation Source Code Generation)
 * Version: 3.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from './types';
import { IService } from './interfaces';

export abstract class BaseService implements IService {
  public abstract readonly serviceName: string;
  private _isInitialized = false;

  public get isInitialized(): boolean {
    return this._isInitialized;
  }

  public async initialize(): Promise<void> {
    if (this._isInitialized) {
      return;
    }
    await this.onInitialize();
    this._isInitialized = true;
  }

  public async shutdown(): Promise<void> {
    if (!this._isInitialized) {
      return;
    }
    await this.onShutdown();
    this._isInitialized = false;
  }

  protected abstract onInitialize(): Promise<void>;
  protected abstract onShutdown(): Promise<void>;
}

export abstract class BaseEntity<TId = UUID> {
  public readonly id: TId;
  public readonly createdAt: ISO8601Timestamp;
  protected updatedAt: ISO8601Timestamp;

  constructor(id: TId, createdAt?: ISO8601Timestamp, updatedAt?: ISO8601Timestamp) {
    this.id = id;
    this.createdAt = createdAt || new Date().toISOString();
    this.updatedAt = updatedAt || this.createdAt;
  }

  public equals(other?: BaseEntity<TId>): boolean {
    if (other === null || other === undefined) {
      return false;
    }
    if (this === other) {
      return true;
    }
    return this.id === other.id;
  }

  protected markUpdated(): void {
    this.updatedAt = new Date().toISOString();
  }
}

export abstract class ValueObject<TProps> {
  protected readonly props: TProps;

  constructor(props: TProps) {
    this.props = Object.freeze({ ...props });
  }

  public equals(vo?: ValueObject<TProps>): boolean {
    if (vo === null || vo === undefined) {
      return false;
    }
    if (vo.props === undefined) {
      return false;
    }
    return JSON.stringify(this.props) === JSON.stringify(vo.props);
  }
}

export interface DomainEvent {
  readonly eventId: UUID;
  readonly occurredOn: ISO8601Timestamp;
  readonly eventType: string;
}

export abstract class AggregateRoot<TId = UUID> extends BaseEntity<TId> {
  private _domainEvents: DomainEvent[] = [];

  public get domainEvents(): ReadonlyArray<DomainEvent> {
    return [...this._domainEvents];
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event);
  }

  public clearEvents(): void {
    this._domainEvents = [];
  }
}

export abstract class BaseRepository<TEntity extends BaseEntity<TId>, TId = UUID> {
  public abstract findById(id: TId): Promise<TEntity | null>;
  public abstract findAll(): Promise<TEntity[]>;
  public abstract save(entity: TEntity): Promise<void>;
  public abstract delete(id: TId): Promise<boolean>;
}
