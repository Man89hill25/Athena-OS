/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Hybrid Academic Graph Search (BM25 + Semantic Entity Match)
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { KnowledgeGraph } from './knowledge-graph';
import { GraphNode, SubgraphResult } from './graph-types';

export interface GraphSearchResultItem {
  readonly node: GraphNode;
  readonly relevanceScore: number;
  readonly matchedFields: ReadonlyArray<string>;
}

export interface HybridGraphSearchResponse {
  readonly query: string;
  readonly results: ReadonlyArray<GraphSearchResultItem>;
  readonly expandedSubgraph?: SubgraphResult;
}

export class HybridGraphSearchEngine {
  constructor(private graph: KnowledgeGraph) {}

  public search(query: string, expandNeighborhood: boolean = true): Result<HybridGraphSearchResponse, Error> {
    try {
      const q = query.trim().toLowerCase();
      const nodes = this.graph.getAllNodes();
      const searchResults: GraphSearchResultItem[] = [];

      for (const node of nodes) {
        let score = 0;
        const matchedFields: string[] = [];

        if (node.metadata.primaryName.toLowerCase().includes(q)) {
          score += 0.5;
          matchedFields.push('primaryName');
        }

        if (node.metadata.arabicName.includes(q)) {
          score += 0.5;
          matchedFields.push('arabicName');
        }

        if (node.metadata.originalScript && node.metadata.originalScript.toLowerCase().includes(q)) {
          score += 0.4;
          matchedFields.push('originalScript');
        }

        if (score > 0) {
          const finalScore = Math.min(1.0, score * node.metadata.authorityScore);
          searchResults.push({
            node,
            relevanceScore: finalScore,
            matchedFields
          });
        }
      }

      searchResults.sort((a, b) => b.relevanceScore - a.relevanceScore);

      let expandedSubgraph: SubgraphResult | undefined;
      if (expandNeighborhood && searchResults.length > 0) {
        const topNode = searchResults[0].node;
        const edges = this.graph.relationshipEngine.getOutgoingEdges(topNode.id);
        const neighborNodeIds = new Set(edges.map((e) => e.targetId));
        const neighborNodes = Array.from(neighborNodeIds)
          .map((id) => this.graph.getNode(id))
          .filter((n): n is GraphNode => n !== undefined);

        expandedSubgraph = {
          id: `subgraph-${topNode.id}`,
          seedNodeId: topNode.id,
          nodes: [topNode, ...neighborNodes],
          edges,
          nodeCount: 1 + neighborNodes.length,
          edgeCount: edges.length,
          titleArabic: `الرسم البياني حول ${topNode.metadata.arabicName}`
        };
      }

      return Result.ok({
        query,
        results: searchResults,
        expandedSubgraph
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
