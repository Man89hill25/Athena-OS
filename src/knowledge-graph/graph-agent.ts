/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Dedicated Knowledge Graph AI Research Agent
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { KnowledgeGraph } from './knowledge-graph';
import { GraphTraversalEngine } from './graph-traversal';
import { GraphAnalyticsEngine } from './graph-analytics';
import { SubgraphResult, PathResult } from './graph-types';

export interface GraphAgentAnalysisReport {
  readonly query: string;
  readonly matchedNodeCount: number;
  readonly subgraph?: SubgraphResult;
  readonly shortestPath?: PathResult;
  readonly ArabicSynthesis: string;
  readonly confidenceScore: number;
}

export class KnowledgeGraphAIAgent {
  private traversalEngine: GraphTraversalEngine;
  private analyticsEngine: GraphAnalyticsEngine;

  constructor(private graph: KnowledgeGraph) {
    this.traversalEngine = new GraphTraversalEngine(graph);
    this.analyticsEngine = new GraphAnalyticsEngine(graph);
  }

  public async analyzeResearchQuery(query: string): Promise<Result<GraphAgentAnalysisReport, Error>> {
    try {
      const q = query.trim().toLowerCase();
      const nodes = this.graph.getAllNodes();

      const matchedNodes = nodes.filter(
        (n) =>
          n.metadata.primaryName.toLowerCase().includes(q) ||
          n.metadata.arabicName.includes(q)
      );

      let subgraph: SubgraphResult | undefined;
      let shortestPath: PathResult | undefined;

      if (matchedNodes.length > 0) {
        const seed = matchedNodes[0];
        const subRes = this.traversalEngine.extractSubgraph(seed.id, 2);
        if (subRes.isSuccess) subgraph = subRes.getValue();

        if (matchedNodes.length >= 2) {
          const pathRes = this.traversalEngine.findShortestPath(matchedNodes[0].id, matchedNodes[1].id);
          if (pathRes.isSuccess) shortestPath = pathRes.getValue();
        }
      }

      const metricsRes = this.analyticsEngine.computeNetworkMetrics();
      const metrics = metricsRes.isSuccess ? metricsRes.getValue() : undefined;

      let ArabicSynthesis = `تقرير استخبارات العلاقات الأكاديمية بالرسم البياني المعرفي عن: "${query}"\n\n`;
      ArabicSynthesis += `• عدد العقد الأكاديمية المطابقة: ${matchedNodes.length}\n`;

      if (metrics) {
        ArabicSynthesis += `• إجمالي حجم الشبكة المعرفية: ${metrics.totalNodes} عقدة و ${metrics.totalEdges} رابطة مع كثافة شبكية قدرها ${(metrics.graphDensity * 100).toFixed(2)}%.\n`;
      }

      if (subgraph) {
        ArabicSynthesis += `• تم استخراج رسم بياني فرعي يضم ${subgraph.nodeCount} عقدة و ${subgraph.edgeCount} حافة تشريعية ولاهوتية.\n`;
      }

      if (shortestPath) {
        ArabicSynthesis += `• مسار الربط المباشر بين (${shortestPath.sourceNode.metadata.arabicName}) و (${shortestPath.targetNode.metadata.arabicName}): عدد الخطوات = ${shortestPath.hopCount}.\n`;
      }

      return Result.ok({
        query,
        matchedNodeCount: matchedNodes.length,
        subgraph,
        shortestPath,
        ArabicSynthesis,
        confidenceScore: 0.98
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
