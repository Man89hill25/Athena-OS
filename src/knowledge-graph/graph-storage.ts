/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Graph Storage Adapter & Serialization Engine
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { KnowledgeGraph } from './knowledge-graph';
import { GraphNode, GraphEdge } from './graph-types';

export interface SerializedGraphPayload {
  readonly version: string;
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly nodes: ReadonlyArray<GraphNode>;
  readonly edges: ReadonlyArray<GraphEdge>;
  readonly exportedAt: string;
}

export class GraphStorageAdapter {
  constructor(private graph: KnowledgeGraph) {}

  public exportGraphJSON(): Result<string, Error> {
    try {
      const payload: SerializedGraphPayload = {
        version: '1.0.0',
        nodeCount: this.graph.getNodeCount(),
        edgeCount: this.graph.getEdgeCount(),
        nodes: this.graph.getAllNodes(),
        edges: this.graph.getAllEdges(),
        exportedAt: new Date().toISOString()
      };

      return Result.ok(JSON.stringify(payload, null, 2));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public importGraphJSON(jsonString: string): Result<number, Error> {
    try {
      const parsed: SerializedGraphPayload = JSON.parse(jsonString);
      let importedCount = 0;

      for (const node of parsed.nodes) {
        const res = this.graph.addNode(node.id, node.metadata);
        if (res.isSuccess) importedCount++;
      }

      for (const edge of parsed.edges) {
        this.graph.addEdge(edge.id, edge.sourceId, edge.targetId, edge.metadata);
      }

      return Result.ok(importedCount);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
