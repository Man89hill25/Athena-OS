/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Relationship Engine (Edge Management & Directional Adjacency Indexing)
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { GraphEdge, RelationshipMetadata } from './graph-types';

export class RelationshipEngine {
  private readonly edgesMap: Map<UUID, GraphEdge> = new Map();
  private readonly outgoingAdjacency: Map<UUID, Set<UUID>> = new Map();
  private readonly incomingAdjacency: Map<UUID, Set<UUID>> = new Map();

  /**
   * Create and register a relationship edge between two entity nodes.
   */
  public createRelationship(
    id: UUID,
    sourceId: UUID,
    targetId: UUID,
    metadata: RelationshipMetadata
  ): Result<GraphEdge, Error> {
    try {
      if (this.edgesMap.has(id)) {
        return Result.fail(new Error(`Relationship edge ${id} already exists.`));
      }

      const timestamp = new Date().toISOString();
      const edge: GraphEdge = {
        id,
        sourceId,
        targetId,
        metadata,
        createdTimestamp: timestamp
      };

      this.edgesMap.set(id, edge);

      // Outgoing
      let outSet = this.outgoingAdjacency.get(sourceId);
      if (!outSet) {
        outSet = new Set();
        this.outgoingAdjacency.set(sourceId, outSet);
      }
      outSet.add(id);

      // Incoming
      let inSet = this.incomingAdjacency.get(targetId);
      if (!inSet) {
        inSet = new Set();
        this.incomingAdjacency.set(targetId, inSet);
      }
      inSet.add(id);

      return Result.ok(edge);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getRelationship(id: UUID): GraphEdge | undefined {
    return this.edgesMap.get(id);
  }

  public getOutgoingEdges(nodeId: UUID): ReadonlyArray<GraphEdge> {
    const edgeIds = this.outgoingAdjacency.get(nodeId);
    if (!edgeIds) return [];
    const edges: GraphEdge[] = [];
    for (const id of edgeIds) {
      const edge = this.edgesMap.get(id);
      if (edge) edges.push(edge);
    }
    return edges;
  }

  public getIncomingEdges(nodeId: UUID): ReadonlyArray<GraphEdge> {
    const edgeIds = this.incomingAdjacency.get(nodeId);
    if (!edgeIds) return [];
    const edges: GraphEdge[] = [];
    for (const id of edgeIds) {
      const edge = this.edgesMap.get(id);
      if (edge) edges.push(edge);
    }
    return edges;
  }

  public getAllRelationships(): ReadonlyArray<GraphEdge> {
    return Array.from(this.edgesMap.values());
  }

  public getRelationshipCount(): number {
    return this.edgesMap.size;
  }
}
