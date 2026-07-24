/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Knowledge Graph Types & Domain Ontology Specifications
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type AcademicLanguage = 'Greek' | 'Latin' | 'Coptic' | 'Syriac' | 'Ge\'ez' | 'Arabic' | 'Armenian' | 'Georgian' | 'English';

export type OntologyCategory =
  | 'ChurchFather'
  | 'Biblical'
  | 'Council'
  | 'Doctrine'
  | 'CanonLaw'
  | 'Manuscript'
  | 'HistoricalEvent'
  | 'Language'
  | 'Person'
  | 'Place'
  | 'Organization'
  | 'Work'
  | 'Bibliography';

export type RelationshipCategory =
  | 'Authored'
  | 'ParticipatedIn'
  | 'ReferencedBy'
  | 'ConfirmedBy'
  | 'TranslatedFrom'
  | 'Anatomizes'
  | 'Opposes'
  | 'Contradicts'
  | 'TransmittedThrough'
  | 'QuotesWork'
  | 'InfluencedBy'
  | 'PromulgatedAt'
  | 'LocatedIn'
  | 'ContemporaryWith';

export interface EntityMetadata {
  readonly primaryName: string;
  readonly arabicName: string;
  readonly originalScript?: string;
  readonly category: OntologyCategory;
  readonly language?: AcademicLanguage;
  readonly historicalPeriod?: string;
  readonly startYear?: number;
  readonly endYear?: number;
  readonly confidenceScore: number; // 0.0 to 1.0
  readonly authorityScore: number;  // 0.0 to 1.0
  readonly attributes: ReadonlyMap<string, string | number | boolean | ReadonlyArray<string>>;
}

export interface GraphNode {
  readonly id: UUID;
  readonly metadata: EntityMetadata;
  readonly createdTimestamp: ISO8601Timestamp;
  readonly lastUpdatedTimestamp: ISO8601Timestamp;
}

export interface RelationshipMetadata {
  readonly category: RelationshipCategory;
  readonly label: string;
  readonly arabicLabel: string;
  readonly weight: number; // 0.0 to 1.0
  readonly isDirectional: boolean;
  readonly historicalEvidenceScore: number;
  readonly citations: ReadonlyArray<string>;
  readonly properties: ReadonlyMap<string, string | number | boolean | ReadonlyArray<string>>;
}

export interface GraphEdge {
  readonly id: UUID;
  readonly sourceId: UUID;
  readonly targetId: UUID;
  readonly metadata: RelationshipMetadata;
  readonly createdTimestamp: ISO8601Timestamp;
}

export interface SubgraphResult {
  readonly id: UUID;
  readonly seedNodeId: UUID;
  readonly nodes: ReadonlyArray<GraphNode>;
  readonly edges: ReadonlyArray<GraphEdge>;
  readonly nodeCount: number;
  readonly edgeCount: number;
  readonly titleArabic: string;
}

export interface TraversalOptions {
  readonly maxDepth?: number;
  readonly minWeightThreshold?: number;
  readonly allowedCategories?: ReadonlyArray<OntologyCategory>;
  readonly allowedRelationships?: ReadonlyArray<RelationshipCategory>;
}

export interface PathResult {
  readonly sourceNode: GraphNode;
  readonly targetNode: GraphNode;
  readonly pathNodes: ReadonlyArray<GraphNode>;
  readonly pathEdges: ReadonlyArray<GraphEdge>;
  readonly hopCount: number;
  readonly cumulativeWeight: number;
}
