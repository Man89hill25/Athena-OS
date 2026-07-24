/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Subsystem: Domain Types & Ontology Metamodel
 * 
 * Directive: ATHENA X Knowledge Graph Engine v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type EntityNodeType = 
  | 'ChurchFather' 
  | 'Council' 
  | 'Manuscript' 
  | 'ScriptureVerse' 
  | 'CanonLaw' 
  | 'TheologicalConcept' 
  | 'GeographicLocation' 
  | 'HistoricalPeriod';

export type RelationshipType = 
  | 'Authored' 
  | 'ParticipatedIn' 
  | 'ReferencedBy' 
  | 'ConfirmedBy' 
  | 'TranslatedFrom' 
  | 'Anatomizes' 
  | 'Opposes' 
  | 'Contradicts' 
  | 'TransmittedThrough';

export type AcademicLanguage = 'Greek' | 'Latin' | 'Coptic' | 'Syriac' | 'Arabic' | 'English';

export interface GraphNodeProperty {
  readonly key: string;
  readonly value: string | number | boolean | ReadonlyArray<string>;
}

export interface GraphNode {
  readonly nodeId: UUID;
  readonly label: string;
  readonly arabicLabel: string;
  readonly nodeType: EntityNodeType;
  readonly primaryLanguage?: AcademicLanguage;
  readonly properties: ReadonlyMap<string, string | number | boolean | ReadonlyArray<string>>;
  readonly historicalConfidence: number; // 0.0 to 1.0
  readonly academicAuthorityScore: number; // 0.0 to 1.0
  readonly createdTimestamp: ISO8601Timestamp;
}

export interface GraphEdge {
  readonly edgeId: UUID;
  readonly sourceNodeId: UUID;
  readonly targetNodeId: UUID;
  readonly relationshipType: RelationshipType;
  readonly label: string;
  readonly arabicLabel: string;
  readonly weight: number; // 0.0 to 1.0
  readonly directional: boolean;
  readonly historicalEvidenceScore: number;
  readonly citationReferences: ReadonlyArray<string>;
}

export interface Subgraph {
  readonly subgraphId: UUID;
  readonly title: string;
  readonly arabicTitle: string;
  readonly nodes: ReadonlyArray<GraphNode>;
  readonly edges: ReadonlyArray<GraphEdge>;
  readonly nodeCount: number;
  readonly edgeCount: number;
}

export interface PathTraversalResult {
  readonly sourceNode: GraphNode;
  readonly targetNode: GraphNode;
  readonly pathNodes: ReadonlyArray<GraphNode>;
  readonly pathEdges: ReadonlyArray<GraphEdge>;
  readonly distance: number; // Hop count
  readonly pathWeight: number;
}

export interface GraphTraversalOptions {
  readonly maxDepth?: number;
  readonly allowedNodeTypes?: ReadonlyArray<EntityNodeType>;
  readonly allowedRelationshipTypes?: ReadonlyArray<RelationshipType>;
  readonly minWeightThreshold?: number;
}
