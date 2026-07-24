/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Graph Traversal Engine (BFS, DFS, Dijkstra Shortest Path, Neighborhoods)
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { KnowledgeGraph } from './knowledge-graph';
import { GraphNode, GraphEdge, PathResult, TraversalOptions, SubgraphResult } from './graph-types';

export class GraphTraversalEngine {
  constructor(private graph: KnowledgeGraph) {}

  /**
   * Breadth-First Traversal (BFS)
   */
  public bfs(startNodeId: UUID, options?: TraversalOptions): Result<ReadonlyArray<GraphNode>, Error> {
    try {
      const startNode = this.graph.getNode(startNodeId);
      if (!startNode) return Result.fail(new Error(`Start node ${startNodeId} not found.`));

      const maxDepth = options?.maxDepth ?? 3;
      const visited = new Set<UUID>();
      const queue: Array<{ id: UUID; depth: number }> = [{ id: startNodeId, depth: 0 }];
      const result: GraphNode[] = [];

      visited.add(startNodeId);

      while (queue.length > 0) {
        const curr = queue.shift()!;
        const node = this.graph.getNode(curr.id);
        if (node) result.push(node);

        if (curr.depth >= maxDepth) continue;

        const edges = this.graph.relationshipEngine.getOutgoingEdges(curr.id);
        for (const edge of edges) {
          if (options?.allowedRelationships && !options.allowedRelationships.includes(edge.metadata.category)) continue;
          if (options?.minWeightThreshold && edge.metadata.weight < options.minWeightThreshold) continue;

          const neighbor = this.graph.getNode(edge.targetId);
          if (!neighbor) continue;
          if (options?.allowedCategories && !options.allowedCategories.includes(neighbor.metadata.category)) continue;

          if (!visited.has(edge.targetId)) {
            visited.add(edge.targetId);
            queue.push({ id: edge.targetId, depth: curr.depth + 1 });
          }
        }
      }

      return Result.ok(result);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Shortest Path via Dijkstra Algorithm
   */
  public findShortestPath(sourceId: UUID, targetId: UUID): Result<PathResult, Error> {
    try {
      const sourceNode = this.graph.getNode(sourceId);
      const targetNode = this.graph.getNode(targetId);

      if (!sourceNode || !targetNode) {
        return Result.fail(new Error("Source or target node not found in Knowledge Graph."));
      }

      const distances = new Map<UUID, number>();
      const prevEdge = new Map<UUID, GraphEdge>();
      const prevNode = new Map<UUID, UUID>();
      const unvisited = new Set<UUID>();

      for (const node of this.graph.getAllNodes()) {
        distances.set(node.id, Infinity);
        unvisited.add(node.id);
      }
      distances.set(sourceId, 0);

      while (unvisited.size > 0) {
        let currentId: UUID | null = null;
        let minDist = Infinity;

        for (const id of unvisited) {
          const d = distances.get(id) ?? Infinity;
          if (d < minDist) {
            minDist = d;
            currentId = id;
          }
        }

        if (currentId === null || minDist === Infinity) break;
        if (currentId === targetId) break;

        unvisited.delete(currentId);

        const edges = this.graph.relationshipEngine.getOutgoingEdges(currentId);
        for (const edge of edges) {
          if (!unvisited.has(edge.targetId)) continue;

          const cost = 1 / (edge.metadata.weight || 0.1);
          const newDist = minDist + cost;

          if (newDist < (distances.get(edge.targetId) ?? Infinity)) {
            distances.set(edge.targetId, newDist);
            prevEdge.set(edge.targetId, edge);
            prevNode.set(edge.targetId, currentId);
          }
        }
      }

      if (distances.get(targetId) === Infinity) {
        return Result.fail(new Error(`No path connects ${sourceId} and ${targetId}.`));
      }

      const pathNodes: GraphNode[] = [];
      const pathEdges: GraphEdge[] = [];
      let currId: UUID | undefined = targetId;

      while (currId) {
        const n = this.graph.getNode(currId);
        if (n) pathNodes.unshift(n);

        const e = prevEdge.get(currId);
        if (e) pathEdges.unshift(e);

        currId = prevNode.get(currId);
      }

      return Result.ok({
        sourceNode,
        targetNode,
        pathNodes,
        pathEdges,
        hopCount: pathEdges.length,
        cumulativeWeight: distances.get(targetId) ?? 0
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Extract Subgraph around seed node
   */
  public extractSubgraph(seedId: UUID, radius: number = 2): Result<SubgraphResult, Error> {
    try {
      const bfsRes = this.bfs(seedId, { maxDepth: radius });
      if (bfsRes.isFailure) return Result.fail(bfsRes.getError());

      const nodes = bfsRes.getValue();
      const nodeIds = new Set(nodes.map((n) => n.id));
      const edges: GraphEdge[] = [];

      for (const edge of this.graph.getAllEdges()) {
        if (nodeIds.has(edge.sourceId) && nodeIds.has(edge.targetId)) {
          edges.push(edge);
        }
      }

      const seedNode = this.graph.getNode(seedId);
      const titleArabic = seedNode ? `الرسم البياني الفرعي للمفهوم ${seedNode.metadata.arabicName}` : 'رسم بياني فرعي';

      return Result.ok({
        id: `subgraph-${seedId}-${Date.now()}`,
        seedNodeId: seedId,
        nodes,
        edges,
        nodeCount: nodes.length,
        edgeCount: edges.length,
        titleArabic
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
