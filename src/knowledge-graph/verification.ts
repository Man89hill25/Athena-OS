/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Verification Engine & Quality Assurance Suite
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { KnowledgeGraph } from './knowledge-graph';

export interface GraphVerificationReport {
  readonly totalNodes: number;
  readonly totalEdges: number;
  readonly isolatedNodesCount: number;
  readonly orphanEdgesCount: number;
  readonly averageAuthorityScore: number;
  readonly verificationPassed: boolean;
  readonly timestamp: string;
}

export class GraphVerificationEngine {
  constructor(private graph: KnowledgeGraph) {}

  public verifyGraphIntegrity(): Result<GraphVerificationReport, Error> {
    try {
      const nodes = this.graph.getAllNodes();
      const edges = this.graph.getAllEdges();

      const connectedNodeIds = new Set<string>();
      let orphanEdgesCount = 0;

      for (const edge of edges) {
        const src = this.graph.getNode(edge.sourceId);
        const tgt = this.graph.getNode(edge.targetId);

        if (!src || !tgt) {
          orphanEdgesCount++;
        } else {
          connectedNodeIds.add(edge.sourceId);
          connectedNodeIds.add(edge.targetId);
        }
      }

      const isolatedNodesCount = nodes.filter((n) => !connectedNodeIds.has(n.id)).length;
      const authoritySum = nodes.reduce((sum, n) => sum + n.metadata.authorityScore, 0);
      const averageAuthorityScore = nodes.length > 0 ? authoritySum / nodes.length : 0;

      const verificationPassed = orphanEdgesCount === 0 && nodes.length > 0 && edges.length > 0;

      return Result.ok({
        totalNodes: nodes.length,
        totalEdges: edges.length,
        isolatedNodesCount,
        orphanEdgesCount,
        averageAuthorityScore,
        verificationPassed,
        timestamp: new Date().toISOString()
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
