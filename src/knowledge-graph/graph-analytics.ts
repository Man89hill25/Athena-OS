/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Graph Analytics Engine (Centrality, Community Detection & Network Metrics)
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { KnowledgeGraph } from './knowledge-graph';
import { OntologyCategory } from './graph-types';

export interface NodeCentralityScore {
  readonly nodeId: UUID;
  readonly primaryName: string;
  readonly degreeCentrality: number;
  readonly authorityCentrality: number;
}

export interface GraphCommunityCluster {
  readonly clusterId: string;
  readonly category: OntologyCategory;
  readonly memberNodeIds: ReadonlyArray<UUID>;
  readonly clusterTitleArabic: string;
}

export interface NetworkMetricsReport {
  readonly totalNodes: number;
  readonly totalEdges: number;
  readonly graphDensity: number;
  readonly topCentralNodes: ReadonlyArray<NodeCentralityScore>;
  readonly communities: ReadonlyArray<GraphCommunityCluster>;
  readonly averageDegree: number;
}

export class GraphAnalyticsEngine {
  constructor(private graph: KnowledgeGraph) {}

  public computeNetworkMetrics(): Result<NetworkMetricsReport, Error> {
    try {
      const nodes = this.graph.getAllNodes();
      const edges = this.graph.getAllEdges();

      const totalNodes = nodes.length;
      const totalEdges = edges.length;

      const density = totalNodes > 1 ? totalEdges / (totalNodes * (totalNodes - 1)) : 0;
      const avgDegree = totalNodes > 0 ? (2 * totalEdges) / totalNodes : 0;

      // Centrality
      const centralityList: NodeCentralityScore[] = [];
      for (const node of nodes) {
        const outE = this.graph.relationshipEngine.getOutgoingEdges(node.id).length;
        const inE = this.graph.relationshipEngine.getIncomingEdges(node.id).length;
        const degree = outE + inE;
        const authority = degree > 0 ? (node.metadata.authorityScore * degree) / Math.max(1, totalNodes) : 0;

        centralityList.push({
          nodeId: node.id,
          primaryName: node.metadata.primaryName,
          degreeCentrality: degree,
          authorityCentrality: authority
        });
      }

      centralityList.sort((a, b) => b.degreeCentrality - a.degreeCentrality);

      // Community Detection by Ontology Category
      const clusterMap = new Map<OntologyCategory, UUID[]>();
      for (const node of nodes) {
        const cat = node.metadata.category;
        const list = clusterMap.get(cat) || [];
        list.push(node.id);
        clusterMap.set(cat, list);
      }

      const communities: GraphCommunityCluster[] = [];
      for (const [cat, memberIds] of clusterMap.entries()) {
        communities.push({
          clusterId: `cluster-${cat.toLowerCase()}`,
          category: cat,
          memberNodeIds: memberIds,
          clusterTitleArabic: `مجموعة كيانات ${cat}`
        });
      }

      return Result.ok({
        totalNodes,
        totalEdges,
        graphDensity: density,
        topCentralNodes: centralityList.slice(0, 5),
        communities,
        averageDegree: avgDegree
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
