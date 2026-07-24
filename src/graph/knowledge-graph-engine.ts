/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Subsystem: Core Knowledge Graph Storage & Traversal Engine
 * 
 * Directive: ATHENA X Knowledge Graph Engine v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { 
  GraphNode, 
  GraphEdge, 
  EntityNodeType, 
  RelationshipType, 
  Subgraph, 
  PathTraversalResult, 
  GraphTraversalOptions 
} from './graph-types';

export class KnowledgeGraphEngine {
  private nodes: Map<UUID, GraphNode> = new Map();
  private edges: Map<UUID, GraphEdge> = new Map();
  private adjacencyList: Map<UUID, Set<UUID>> = new Map(); // Source -> Set of Edge IDs
  private reverseAdjacencyList: Map<UUID, Set<UUID>> = new Map(); // Target -> Set of Edge IDs

  constructor() {
    this.seedInitialAcademicKnowledgeGraph();
  }

  /**
   * Add a node to the knowledge graph.
   */
  public addNode(node: GraphNode): Result<UUID, Error> {
    try {
      this.nodes.set(node.nodeId, node);
      if (!this.adjacencyList.has(node.nodeId)) {
        this.adjacencyList.set(node.nodeId, new Set());
      }
      if (!this.reverseAdjacencyList.has(node.nodeId)) {
        this.reverseAdjacencyList.set(node.nodeId, new Set());
      }
      return Result.ok(node.nodeId);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Add an edge between two existing nodes.
   */
  public addEdge(edge: GraphEdge): Result<UUID, Error> {
    try {
      if (!this.nodes.has(edge.sourceNodeId)) {
        return Result.fail(new Error(`Source node ${edge.sourceNodeId} does not exist in graph.`));
      }
      if (!this.nodes.has(edge.targetNodeId)) {
        return Result.fail(new Error(`Target node ${edge.targetNodeId} does not exist in graph.`));
      }

      this.edges.set(edge.edgeId, edge);

      let sourceSet = this.adjacencyList.get(edge.sourceNodeId);
      if (!sourceSet) {
        sourceSet = new Set();
        this.adjacencyList.set(edge.sourceNodeId, sourceSet);
      }
      sourceSet.add(edge.edgeId);

      let targetSet = this.reverseAdjacencyList.get(edge.targetNodeId);
      if (!targetSet) {
        targetSet = new Set();
        this.reverseAdjacencyList.set(edge.targetNodeId, targetSet);
      }
      targetSet.add(edge.edgeId);

      return Result.ok(edge.edgeId);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getNode(nodeId: UUID): GraphNode | undefined {
    return this.nodes.get(nodeId);
  }

  public getEdge(edgeId: UUID): GraphEdge | undefined {
    return this.edges.get(edgeId);
  }

  public getNodeCount(): number {
    return this.nodes.size;
  }

  public getEdgeCount(): number {
    return this.edges.size;
  }

  public getAllNodes(): ReadonlyArray<GraphNode> {
    return Array.from(this.nodes.values());
  }

  public getAllEdges(): ReadonlyArray<GraphEdge> {
    return Array.from(this.edges.values());
  }

  /**
   * Find nodes by label or property match.
   */
  public searchNodes(query: string, nodeType?: EntityNodeType): ReadonlyArray<GraphNode> {
    const q = query.toLowerCase();
    const results: GraphNode[] = [];

    for (const node of this.nodes.values()) {
      if (nodeType && node.nodeType !== nodeType) continue;

      const matchesLabel = node.label.toLowerCase().includes(q) || node.arabicLabel.includes(q);
      if (matchesLabel) {
        results.push(node);
      }
    }

    return results;
  }

  /**
   * Breadth-First Search (BFS) Traversal starting from a given node.
   */
  public bfsTraversal(
    startNodeId: UUID,
    options?: GraphTraversalOptions
  ): Result<ReadonlyArray<GraphNode>, Error> {
    try {
      if (!this.nodes.has(startNodeId)) {
        return Result.fail(new Error(`Start node ${startNodeId} not found.`));
      }

      const maxDepth = options?.maxDepth ?? 3;
      const visited = new Set<UUID>();
      const queue: Array<{ nodeId: UUID; depth: number }> = [{ nodeId: startNodeId, depth: 0 }];
      const resultNodes: GraphNode[] = [];

      visited.add(startNodeId);

      while (queue.length > 0) {
        const current = queue.shift()!;
        const currNode = this.nodes.get(current.nodeId);
        if (currNode) {
          resultNodes.push(currNode);
        }

        if (current.depth >= maxDepth) continue;

        const outgoingEdgeIds = this.adjacencyList.get(current.nodeId) || new Set();
        for (const edgeId of outgoingEdgeIds) {
          const edge = this.edges.get(edgeId);
          if (!edge) continue;

          if (options?.allowedRelationshipTypes && !options.allowedRelationshipTypes.includes(edge.relationshipType)) {
            continue;
          }

          if (options?.minWeightThreshold && edge.weight < options.minWeightThreshold) {
            continue;
          }

          const targetNode = this.nodes.get(edge.targetNodeId);
          if (!targetNode) continue;

          if (options?.allowedNodeTypes && !options.allowedNodeTypes.includes(targetNode.nodeType)) {
            continue;
          }

          if (!visited.has(edge.targetNodeId)) {
            visited.add(edge.targetNodeId);
            queue.push({ nodeId: edge.targetNodeId, depth: current.depth + 1 });
          }
        }
      }

      return Result.ok(resultNodes);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Depth-First Search (DFS) Traversal starting from a given node.
   */
  public dfsTraversal(
    startNodeId: UUID,
    options?: GraphTraversalOptions
  ): Result<ReadonlyArray<GraphNode>, Error> {
    try {
      if (!this.nodes.has(startNodeId)) {
        return Result.fail(new Error(`Start node ${startNodeId} not found.`));
      }

      const maxDepth = options?.maxDepth ?? 3;
      const visited = new Set<UUID>();
      const resultNodes: GraphNode[] = [];

      const dfs = (nodeId: UUID, depth: number) => {
        visited.add(nodeId);
        const node = this.nodes.get(nodeId);
        if (node) resultNodes.push(node);

        if (depth >= maxDepth) return;

        const outgoingEdgeIds = this.adjacencyList.get(nodeId) || new Set();
        for (const edgeId of outgoingEdgeIds) {
          const edge = this.edges.get(edgeId);
          if (!edge) continue;

          if (options?.allowedRelationshipTypes && !options.allowedRelationshipTypes.includes(edge.relationshipType)) {
            continue;
          }

          const targetNode = this.nodes.get(edge.targetNodeId);
          if (!targetNode || visited.has(edge.targetNodeId)) continue;

          if (options?.allowedNodeTypes && !options.allowedNodeTypes.includes(targetNode.nodeType)) {
            continue;
          }

          dfs(edge.targetNodeId, depth + 1);
        }
      };

      dfs(startNodeId, 0);
      return Result.ok(resultNodes);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Find Shortest Path between two nodes using Dijkstra's algorithm.
   */
  public findShortestPath(
    sourceNodeId: UUID,
    targetNodeId: UUID
  ): Result<PathTraversalResult, Error> {
    try {
      const sourceNode = this.nodes.get(sourceNodeId);
      const targetNode = this.nodes.get(targetNodeId);

      if (!sourceNode || !targetNode) {
        return Result.fail(new Error("Source or target node not found in graph."));
      }

      const distances = new Map<UUID, number>();
      const previousEdge = new Map<UUID, GraphEdge>();
      const previousNode = new Map<UUID, UUID>();
      const unvisited = new Set<UUID>();

      for (const nodeId of this.nodes.keys()) {
        distances.set(nodeId, Infinity);
        unvisited.add(nodeId);
      }
      distances.set(sourceNodeId, 0);

      while (unvisited.size > 0) {
        let currentId: UUID | null = null;
        let smallestDist = Infinity;

        for (const id of unvisited) {
          const d = distances.get(id) ?? Infinity;
          if (d < smallestDist) {
            smallestDist = d;
            currentId = id;
          }
        }

        if (currentId === null || smallestDist === Infinity) break;
        if (currentId === targetNodeId) break;

        unvisited.delete(currentId);

        const edgeIds = this.adjacencyList.get(currentId) || new Set();
        for (const edgeId of edgeIds) {
          const edge = this.edges.get(edgeId);
          if (!edge) continue;

          const neighborId = edge.targetNodeId;
          if (!unvisited.has(neighborId)) continue;

          // Cost inversely proportional to edge weight
          const cost = 1 / (edge.weight || 0.1);
          const newDist = smallestDist + cost;

          if (newDist < (distances.get(neighborId) ?? Infinity)) {
            distances.set(neighborId, newDist);
            previousEdge.set(neighborId, edge);
            previousNode.set(neighborId, currentId);
          }
        }
      }

      if (distances.get(targetNodeId) === Infinity) {
        return Result.fail(new Error(`No path exists between node ${sourceNodeId} and ${targetNodeId}.`));
      }

      // Reconstruct Path
      const pathNodes: GraphNode[] = [];
      const pathEdges: GraphEdge[] = [];
      let currId: UUID | undefined = targetNodeId;

      while (currId) {
        const n = this.nodes.get(currId);
        if (n) pathNodes.unshift(n);

        const e = previousEdge.get(currId);
        if (e) pathEdges.unshift(e);

        currId = previousNode.get(currId);
      }

      return Result.ok({
        sourceNode,
        targetNode,
        pathNodes,
        pathEdges,
        distance: pathEdges.length,
        pathWeight: distances.get(targetNodeId) ?? 0,
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Extract Subgraph around a seed node.
   */
  public extractSubgraph(seedNodeId: UUID, radius: number = 2): Result<Subgraph, Error> {
    try {
      const bfsResult = this.bfsTraversal(seedNodeId, { maxDepth: radius });
      if (bfsResult.isFailure) {
        return Result.fail(bfsResult.getError());
      }

      const extractedNodes = bfsResult.getValue();
      const nodeSet = new Set(extractedNodes.map((n) => n.nodeId));
      const extractedEdges: GraphEdge[] = [];

      for (const edge of this.edges.values()) {
        if (nodeSet.has(edge.sourceNodeId) && nodeSet.has(edge.targetNodeId)) {
          extractedEdges.push(edge);
        }
      }

      const seedNode = this.nodes.get(seedNodeId);
      const title = seedNode ? `Subgraph around ${seedNode.label}` : 'Extracted Subgraph';
      const arabicTitle = seedNode ? `الرسم البياني الفرعي حول ${seedNode.arabicLabel}` : 'الرسم البياني المعرفي الفرعي';

      return Result.ok({
        subgraphId: `subgraph-${seedNodeId}-${Date.now()}`,
        title,
        arabicTitle,
        nodes: extractedNodes,
        edges: extractedEdges,
        nodeCount: extractedNodes.length,
        edgeCount: extractedEdges.length,
      });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Seed Initial High-Authority Academic Knowledge Graph with Council, Fathers, Manuscripts, Scripture, and Canons.
   */
  private seedInitialAcademicKnowledgeGraph(): void {
    const timestamp = new Date().toISOString();

    // 1. Nodes: Church Fathers
    const athanasius: GraphNode = {
      nodeId: 'node-father-athanasius',
      label: 'Athanasius of Alexandria',
      arabicLabel: 'القديس أثناسيوس الرسولي ب Patriarch of Alexandria',
      nodeType: 'ChurchFather',
      primaryLanguage: 'Greek',
      properties: new Map([
        ['title', 'Patriarch of Alexandria'],
        ['era', '296–373 AD'],
        ['keyWork', 'De Incarnatione Verbi'],
      ]),
      historicalConfidence: 0.99,
      academicAuthorityScore: 0.98,
      createdTimestamp: timestamp,
    };

    const cyril: GraphNode = {
      nodeId: 'node-father-cyril',
      label: 'Cyril of Alexandria',
      arabicLabel: 'القديس كيرلس الكبير عمود الدين',
      nodeType: 'ChurchFather',
      primaryLanguage: 'Greek',
      properties: new Map([
        ['title', 'Patriarch of Alexandria'],
        ['era', '376–444 AD'],
        ['keyWork', 'Anathematisms'],
      ]),
      historicalConfidence: 0.99,
      academicAuthorityScore: 0.98,
      createdTimestamp: timestamp,
    };

    // 2. Nodes: Councils
    const Nicaea: GraphNode = {
      nodeId: 'node-council-nicaea',
      label: 'First Council of Nicaea (325 AD)',
      arabicLabel: 'مجمع نيقية المسكوني الأول (325 م)',
      nodeType: 'Council',
      primaryLanguage: 'Greek',
      properties: new Map<string, string | number | boolean | ReadonlyArray<string>>([
        ['year', 325],
        ['attendeesCount', 318],
        ['keyCreed', 'Nicene Creed (Homoousios)'],
      ]),
      historicalConfidence: 1.0,
      academicAuthorityScore: 0.99,
      createdTimestamp: timestamp,
    };

    const Ephesus: GraphNode = {
      nodeId: 'node-council-ephesus',
      label: 'Council of Ephesus (431 AD)',
      arabicLabel: 'مجمع أفسس المسكوني (431 م)',
      nodeType: 'Council',
      primaryLanguage: 'Greek',
      properties: new Map<string, string | number | boolean | ReadonlyArray<string>>([
        ['year', 431],
        ['keyDogma', 'Theotokos (Mother of God)'],
      ]),
      historicalConfidence: 1.0,
      academicAuthorityScore: 0.99,
      createdTimestamp: timestamp,
    };

    // 3. Nodes: Scripture & Manuscripts
    const john1: GraphNode = {
      nodeId: 'node-verse-john1',
      label: 'John 1:1 - Logos Incarnation',
      arabicLabel: 'إنجيل يوحنا 1:1 - في البدء كان الكلمة',
      nodeType: 'ScriptureVerse',
      primaryLanguage: 'Greek',
      properties: new Map<string, string | number | boolean | ReadonlyArray<string>>([
        ['book', 'John'],
        ['chapter', 1],
        ['verse', 1],
        ['textGreek', 'Ἐν ἀρχῇ ἦν ὁ λόγος'],
      ]),
      historicalConfidence: 1.0,
      academicAuthorityScore: 1.0,
      createdTimestamp: timestamp,
    };

    const codexVaticanus: GraphNode = {
      nodeId: 'node-ms-vaticanus',
      label: 'Codex Vaticanus (B, 03)',
      arabicLabel: 'المخطوطة الفاتيكانية (القرن الرابع)',
      nodeType: 'Manuscript',
      primaryLanguage: 'Greek',
      properties: new Map([
        ['century', '4th Century AD'],
        ['location', 'Vatican Library'],
      ]),
      historicalConfidence: 0.98,
      academicAuthorityScore: 0.97,
      createdTimestamp: timestamp,
    };

    // 4. Nodes: Canon Law & Theological Concepts
    const niceneCanon1: GraphNode = {
      nodeId: 'node-canon-nicaea-1',
      label: 'Nicene Canon 1',
      arabicLabel: 'القانون الأول من قوانين مجمع نيقية',
      nodeType: 'CanonLaw',
      primaryLanguage: 'Greek',
      properties: new Map([
        ['council', 'Nicaea I'],
        ['subject', 'Clerical Ordination Rules'],
      ]),
      historicalConfidence: 0.99,
      academicAuthorityScore: 0.96,
      createdTimestamp: timestamp,
    };

    const homoousiosConcept: GraphNode = {
      nodeId: 'node-concept-homoousios',
      label: 'Homoousios (Consubstantial)',
      arabicLabel: 'مفهوم مساوٍ في جوهر (المساواة في جوهر اللاهوت)',
      nodeType: 'TheologicalConcept',
      primaryLanguage: 'Greek',
      properties: new Map([
        ['term', 'Homoousios'],
        ['definition', 'Of one and the same substance'],
      ]),
      historicalConfidence: 1.0,
      academicAuthorityScore: 0.99,
      createdTimestamp: timestamp,
    };

    // Add all Nodes
    [athanasius, cyril, Nicaea, Ephesus, john1, codexVaticanus, niceneCanon1, homoousiosConcept].forEach((n) => this.addNode(n));

    // Edges
    const edge1: GraphEdge = {
      edgeId: 'edge-athanasius-nicaea',
      sourceNodeId: 'node-father-athanasius',
      targetNodeId: 'node-council-nicaea',
      relationshipType: 'ParticipatedIn',
      label: 'Participated as Deacon and Champion of Homoousios',
      arabicLabel: 'شارك كشماس ومدافع عن قانون الإيمان',
      weight: 0.98,
      directional: true,
      historicalEvidenceScore: 0.99,
      citationReferences: ['Athanasius De Decretis 1', 'Socrates Scholasticus HE I.8'],
    };

    const edge2: GraphEdge = {
      edgeId: 'edge-cyril-ephesus',
      sourceNodeId: 'node-father-cyril',
      targetNodeId: 'node-council-ephesus',
      relationshipType: 'ParticipatedIn',
      label: 'Presided over Council of Ephesus',
      arabicLabel: 'ترأس مجمع أفسس المسكوني',
      weight: 0.99,
      directional: true,
      historicalEvidenceScore: 0.99,
      citationReferences: ['Epistles of Cyril to Nestorius'],
    };

    const edge3: GraphEdge = {
      edgeId: 'edge-athanasius-john1',
      sourceNodeId: 'node-father-athanasius',
      targetNodeId: 'node-verse-john1',
      relationshipType: 'ReferencedBy',
      label: 'Exegesis in De Incarnatione',
      arabicLabel: 'تفسير واستشهاد في كتاب تجسد الكلمة',
      weight: 0.95,
      directional: true,
      historicalEvidenceScore: 0.98,
      citationReferences: ['De Incarnatione Verbi 1.1'],
    };

    const edge4: GraphEdge = {
      edgeId: 'edge-nicaea-canon1',
      sourceNodeId: 'node-council-nicaea',
      targetNodeId: 'node-canon-nicaea-1',
      relationshipType: 'Authored',
      label: 'Enacted Canon Law 1',
      arabicLabel: 'أصدر القانون الأول',
      weight: 1.0,
      directional: true,
      historicalEvidenceScore: 1.0,
      citationReferences: ['Mansi II, 668'],
    };

    const edge5: GraphEdge = {
      edgeId: 'edge-nicaea-homoousios',
      sourceNodeId: 'node-council-nicaea',
      targetNodeId: 'node-concept-homoousios',
      relationshipType: 'ConfirmedBy',
      label: 'Promulgated Dogma of Homoousios',
      arabicLabel: 'أقر العقيدة والاصطلاح',
      weight: 1.0,
      directional: true,
      historicalEvidenceScore: 1.0,
      citationReferences: ['Nicene Creed Text 325 AD'],
    };

    const edge6: GraphEdge = {
      edgeId: 'edge-ms-john1',
      sourceNodeId: 'node-ms-vaticanus',
      targetNodeId: 'node-verse-john1',
      relationshipType: 'TransmittedThrough',
      label: 'Preserves Manuscript Text of John 1:1',
      arabicLabel: 'يحفظ نص إنجيل يوحنا',
      weight: 0.97,
      directional: true,
      historicalEvidenceScore: 0.99,
      citationReferences: ['NT Textual Criticism Index'],
    };

    [edge1, edge2, edge3, edge4, edge5, edge6].forEach((e) => this.addEdge(e));
  }
}
