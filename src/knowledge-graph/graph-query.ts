/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Cypher-like Declarative Graph Query Language API
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { KnowledgeGraph } from './knowledge-graph';
import { GraphNode, GraphEdge, OntologyCategory, RelationshipCategory } from './graph-types';

export interface GraphQueryMatchPattern {
  readonly nodeCategory?: OntologyCategory;
  readonly nodeNameContains?: string;
  readonly relationshipCategory?: RelationshipCategory;
  readonly minWeight?: number;
}

export interface GraphQueryResult {
  readonly matchedNodes: ReadonlyArray<GraphNode>;
  readonly matchedEdges: ReadonlyArray<GraphEdge>;
  readonly totalMatches: number;
  readonly executionTimeMs: number;
}

export class GraphQueryEngine {
  constructor(private graph: KnowledgeGraph) {}

  /**
   * Execute a Cypher-like pattern query against the knowledge graph.
   */
  public executeQuery(pattern: GraphQueryMatchPattern): Result<GraphQueryResult, Error> {
    const startTime = Date.now();
    try {
      const allNodes = this.graph.getAllNodes();
      const allEdges = this.graph.getAllEdges();

      let filteredNodes = allNodes;

      if (pattern.nodeCategory) {
        filteredNodes = filteredNodes.filter((n) => n.metadata.category === pattern.nodeCategory);
      }

      if (pattern.nodeNameContains) {
        const q = pattern.nodeNameContains.toLowerCase();
        filteredNodes = filteredNodes.filter(
          (n) =>
            n.metadata.primaryName.toLowerCase().includes(q) ||
            n.metadata.arabicName.includes(q)
        );
      }

      const nodeIds = new Set(filteredNodes.map((n) => n.id));
      let filteredEdges = allEdges.filter((e) => nodeIds.has(e.sourceId) || nodeIds.has(e.targetId));

      if (pattern.relationshipCategory) {
        filteredEdges = filteredEdges.filter((e) => e.metadata.category === pattern.relationshipCategory);
      }

      if (pattern.minWeight !== undefined) {
        filteredEdges = filteredEdges.filter((e) => e.metadata.weight >= pattern.minWeight!);
      }

      const executionTimeMs = Date.now() - startTime;

      return Result.ok({
        matchedNodes: filteredNodes,
        matchedEdges: filteredEdges,
        totalMatches: filteredNodes.length,
        executionTimeMs
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
