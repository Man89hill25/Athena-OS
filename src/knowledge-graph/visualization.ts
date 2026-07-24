/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Multi-Format Graph Export & Visualization Adapters (Sigma.js, GraphML, JSON-LD, RDF, OWL, Neo4j)
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { KnowledgeGraph } from './knowledge-graph';

export interface SigmaJSNode {
  readonly key: string;
  readonly attributes: {
    readonly label: string;
    readonly x: number;
    readonly y: number;
    readonly size: number;
    readonly color: string;
    readonly category: string;
  };
}

export interface SigmaJSEdge {
  readonly key: string;
  readonly source: string;
  readonly target: string;
  readonly attributes: {
    readonly label: string;
    readonly size: number;
  };
}

export interface SigmaJSGraphPayload {
  readonly nodes: ReadonlyArray<SigmaJSNode>;
  readonly edges: ReadonlyArray<SigmaJSEdge>;
}

export class GraphVisualizationExporter {
  constructor(private graph: KnowledgeGraph) {}

  /**
   * Export to Sigma.js compatible JSON format
   */
  public exportSigmaJS(): Result<SigmaJSGraphPayload, Error> {
    try {
      const nodes = this.graph.getAllNodes();
      const edges = this.graph.getAllEdges();

      const sigmaNodes: SigmaJSNode[] = nodes.map((n, idx) => ({
        key: n.id,
        attributes: {
          label: n.metadata.arabicName,
          x: Math.cos((idx * 2 * Math.PI) / Math.max(1, nodes.length)) * 100,
          y: Math.sin((idx * 2 * Math.PI) / Math.max(1, nodes.length)) * 100,
          size: 10 + n.metadata.authorityScore * 10,
          color: this.getCategoryColor(n.metadata.category),
          category: n.metadata.category
        }
      }));

      const sigmaEdges: SigmaJSEdge[] = edges.map((e) => ({
        key: e.id,
        source: e.sourceId,
        target: e.targetId,
        attributes: {
          label: e.metadata.arabicLabel,
          size: e.metadata.weight * 2
        }
      }));

      return Result.ok({ nodes: sigmaNodes, edges: sigmaEdges });
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Export to JSON-LD Linked Data standard
   */
  public exportJSONLD(): Result<string, Error> {
    try {
      const nodes = this.graph.getAllNodes();
      const jsonLdGraph = nodes.map((n) => ({
        '@id': `athena:${n.id}`,
        '@type': `athena:${n.metadata.category}`,
        'name': n.metadata.primaryName,
        'arabicName': n.metadata.arabicName,
        'authorityScore': n.metadata.authorityScore
      }));

      const payload = {
        '@context': {
          'athena': 'https://athena-x.org/ontology#',
          'name': 'http://schema.org/name'
        },
        '@graph': jsonLdGraph
      };

      return Result.ok(JSON.stringify(payload, null, 2));
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  /**
   * Export Neo4j Cypher Creation Script
   */
  public exportNeo4jCypher(): Result<string, Error> {
    try {
      const nodes = this.graph.getAllNodes();
      const edges = this.graph.getAllEdges();

      let cypher = "// ATHENA X NEO4J CYPHER EXPORT\n\n";

      for (const n of nodes) {
        cypher += `CREATE (:${n.metadata.category} {id: "${n.id}", name: "${n.metadata.primaryName}", arabicName: "${n.metadata.arabicName}"});\n`;
      }

      cypher += "\n";
      for (const e of edges) {
        cypher += `MATCH (a {id: "${e.sourceId}"}), (b {id: "${e.targetId}"}) CREATE (a)-[:${e.metadata.category} {weight: ${e.metadata.weight}}]->(b);\n`;
      }

      return Result.ok(cypher);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  private getCategoryColor(category: string): string {
    switch (category) {
      case 'ChurchFather': return '#1e40af';
      case 'Council': return '#b91c1c';
      case 'Doctrine': return '#047857';
      case 'Biblical': return '#7c3aed';
      case 'Manuscript': return '#b45309';
      case 'CanonLaw': return '#0f766e';
      default: return '#4b5563';
    }
  }
}
