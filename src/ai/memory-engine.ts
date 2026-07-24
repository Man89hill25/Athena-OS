/**
 * ==========================================================================================================
 * ATHENA X - ARTIFICIAL INTELLIGENCE OPERATING LAYER
 * Subsystem: Memory Engine
 * 
 * Directive: 205 (AI Orchestrator & Multi-Agent Intelligence Layer)
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export interface MemoryRecord {
  readonly id: UUID;
  readonly scope: 'SHORT' | 'CONVERSATION' | 'RESEARCH' | 'PROJECT' | 'KNOWLEDGE';
  readonly key: string;
  readonly value: unknown;
  readonly tags: ReadonlyArray<string>;
  readonly createdAt: ISO8601Timestamp;
  readonly expiresAt?: ISO8601Timestamp;
}

export class MemoryEngine {
  private memoryStore: Map<string, MemoryRecord> = new Map();

  public setShortMemory(key: string, value: unknown, ttlSeconds = 300): void {
    const id = crypto.randomUUID();
    const now = new Date();
    const expiresAt = new Date(now.getTime() + ttlSeconds * 1000).toISOString() as ISO8601Timestamp;

    this.memoryStore.set(`SHORT:${key}`, {
      id,
      scope: 'SHORT',
      key,
      value,
      tags: ['ephemeral', 'short'],
      createdAt: now.toISOString() as ISO8601Timestamp,
      expiresAt,
    });
  }

  public getShortMemory<T>(key: string): T | undefined {
    const record = this.memoryStore.get(`SHORT:${key}`);
    if (!record) return undefined;

    if (record.expiresAt && new Date(record.expiresAt) < new Date()) {
      this.memoryStore.delete(`SHORT:${key}`);
      return undefined;
    }

    return record.value as T;
  }

  public appendConversationTurn(userId: UUID, role: 'user' | 'assistant', content: string): void {
    const key = `CONVERSATION:${userId}`;
    const existing = (this.memoryStore.get(key)?.value as Array<{ role: string; content: string }>) || [];
    existing.push({ role, content });

    this.memoryStore.set(key, {
      id: crypto.randomUUID(),
      scope: 'CONVERSATION',
      key,
      value: existing,
      tags: ['conversation', userId],
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    });
  }

  public getConversationHistory(userId: UUID): ReadonlyArray<{ role: string; content: string }> {
    const record = this.memoryStore.get(`CONVERSATION:${userId}`);
    return (record?.value as ReadonlyArray<{ role: string; content: string }>) || [];
  }

  public storeResearchMemory(topic: string, findings: unknown, tags: ReadonlyArray<string> = []): void {
    const key = `RESEARCH:${topic}`;
    this.memoryStore.set(key, {
      id: crypto.randomUUID(),
      scope: 'RESEARCH',
      key: topic,
      value: findings,
      tags: ['research', ...tags],
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    });
  }

  public storeProjectMemory(projectId: UUID, keyName: string, data: unknown): void {
    const storeKey = `PROJECT:${projectId}:${keyName}`;
    this.memoryStore.set(storeKey, {
      id: crypto.randomUUID(),
      scope: 'PROJECT',
      key: keyName,
      value: data,
      tags: ['project', projectId],
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    });
  }

  public storeKnowledgeFact(factKey: string, factValue: unknown, citations: ReadonlyArray<string>): void {
    const storeKey = `KNOWLEDGE:${factKey}`;
    this.memoryStore.set(storeKey, {
      id: crypto.randomUUID(),
      scope: 'KNOWLEDGE',
      key: factKey,
      value: { factValue, citations },
      tags: ['knowledge', 'verified-fact'],
      createdAt: new Date().toISOString() as ISO8601Timestamp,
    });
  }

  public getKnowledgeFact(factKey: string): { factValue: unknown; citations: ReadonlyArray<string> } | undefined {
    const record = this.memoryStore.get(`KNOWLEDGE:${factKey}`);
    return record?.value as { factValue: unknown; citations: ReadonlyArray<string> } | undefined;
  }

  public clearShortMemory(): void {
    for (const [k, v] of this.memoryStore.entries()) {
      if (v.scope === 'SHORT') {
        this.memoryStore.delete(k);
      }
    }
  }
}
