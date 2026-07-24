/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Core Knowledge Graph Master Orchestrator
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { EntityEngine } from './entity-engine';
import { RelationshipEngine } from './relationship-engine';
import { GraphNode, GraphEdge, EntityMetadata, RelationshipMetadata, OntologyCategory } from './graph-types';

export class KnowledgeGraph {
  public readonly entityEngine: EntityEngine;
  public readonly relationshipEngine: RelationshipEngine;

  constructor() {
    this.entityEngine = new EntityEngine();
    this.relationshipEngine = new RelationshipEngine();
    this.seedDomainOntologyGraph();
  }

  public addNode(id: UUID, metadata: EntityMetadata): Result<GraphNode, Error> {
    return this.entityEngine.createEntity(id, metadata);
  }

  public addEdge(id: UUID, sourceId: UUID, targetId: UUID, metadata: RelationshipMetadata): Result<GraphEdge, Error> {
    const src = this.entityEngine.getEntity(sourceId);
    const tgt = this.entityEngine.getEntity(targetId);
    if (!src || !tgt) {
      return Result.fail(new Error("Source or target entity does not exist in graph."));
    }
    return this.relationshipEngine.createRelationship(id, sourceId, targetId, metadata);
  }

  public getNode(id: UUID): GraphNode | undefined {
    return this.entityEngine.getEntity(id);
  }

  public getEdge(id: UUID): GraphEdge | undefined {
    return this.relationshipEngine.getRelationship(id);
  }

  public getAllNodes(): ReadonlyArray<GraphNode> {
    return this.entityEngine.getAllEntities();
  }

  public getAllEdges(): ReadonlyArray<GraphEdge> {
    return this.relationshipEngine.getAllRelationships();
  }

  public getNodesByCategory(category: OntologyCategory): ReadonlyArray<GraphNode> {
    return this.entityEngine.getEntitiesByCategory(category);
  }

  public getNodeCount(): number {
    return this.entityEngine.getEntityCount();
  }

  public getEdgeCount(): number {
    return this.relationshipEngine.getRelationshipCount();
  }

  /**
   * Seed rich high-authority academic entities across all sub-ontologies.
   */
  private seedDomainOntologyGraph(): void {
    // 1. Church Fathers
    this.addNode('node-father-athanasius', {
      primaryName: 'Saint Athanasius of Alexandria',
      arabicName: 'القديس أثناسيوس الرسولي حامي الإيمان',
      originalScript: 'Ἀθανάσιος Ἀλεξανδρείας',
      category: 'ChurchFather',
      language: 'Greek',
      historicalPeriod: 'Early Patristic (4th Century)',
      startYear: 296,
      endYear: 373,
      confidenceScore: 1.0,
      authorityScore: 0.99,
      attributes: new Map<string, string | number | boolean | ReadonlyArray<string>>([
        ['seeTitle', 'Patriarch of Alexandria'],
        ['patristicPeriod', 'Nicene Father']
      ])
    });

    this.addNode('node-father-cyril', {
      primaryName: 'Saint Cyril of Alexandria',
      arabicName: 'القديس كيرلس الكبير عمود الدين',
      originalScript: 'Κύριλλος Ἀλεξανδρείας',
      category: 'ChurchFather',
      language: 'Greek',
      historicalPeriod: '5th Century Patristic',
      startYear: 376,
      endYear: 444,
      confidenceScore: 1.0,
      authorityScore: 0.99,
      attributes: new Map<string, string | number | boolean | ReadonlyArray<string>>([
        ['seeTitle', 'Patriarch of Alexandria'],
        ['patristicPeriod', 'Post-Nicene Father']
      ])
    });

    // 2. Council
    this.addNode('node-council-nicaea', {
      primaryName: 'First Ecumenical Council of Nicaea',
      arabicName: 'مجمع نيقية المسكوني الأول (325 م)',
      category: 'Council',
      language: 'Greek',
      historicalPeriod: '4th Century',
      startYear: 325,
      endYear: 325,
      confidenceScore: 1.0,
      authorityScore: 1.0,
      attributes: new Map<string, string | number | boolean | ReadonlyArray<string>>([
        ['year', 325],
        ['councilType', 'Ecumenical']
      ])
    });

    // 3. Doctrine
    this.addNode('node-doctrine-homoousios', {
      primaryName: 'Homoousios (Consubstantial)',
      arabicName: 'مفهوم مساوٍ في الجوهر (المساواة الجوهرية)',
      originalScript: 'Ὁμοούσιος',
      category: 'Doctrine',
      language: 'Greek',
      historicalPeriod: 'Nicene Era',
      confidenceScore: 1.0,
      authorityScore: 1.0,
      attributes: new Map<string, string | number | boolean | ReadonlyArray<string>>([
        ['dogmaTitle', 'Consubstantiality of the Son with the Father'],
        ['technicalTermGreek', 'Homoousios']
      ])
    });

    // 4. Biblical Verse
    this.addNode('node-biblical-john1', {
      primaryName: 'John 1:1 - Incarnation Prologue',
      arabicName: 'إنجيل يوحنا 1:1 - في البدء كان الكلمة',
      originalScript: 'Ἐν ἀρχῇ ἦν ὁ λόγος',
      category: 'Biblical',
      language: 'Greek',
      confidenceScore: 1.0,
      authorityScore: 1.0,
      attributes: new Map<string, string | number | boolean | ReadonlyArray<string>>([
        ['testament', 'New Testament'],
        ['book', 'John'],
        ['chapter', 1],
        ['verse', 1]
      ])
    });

    // 5. Manuscript
    this.addNode('node-ms-vaticanus', {
      primaryName: 'Codex Vaticanus (B, 03)',
      arabicName: 'المخطوطة الفاتيكانية (القرن الرابع)',
      category: 'Manuscript',
      language: 'Greek',
      historicalPeriod: '4th Century',
      confidenceScore: 0.99,
      authorityScore: 0.98,
      attributes: new Map<string, string | number | boolean | ReadonlyArray<string>>([
        ['shelfmark', 'Vat.gr.1209'],
        ['holdingInstitution', 'Vatican Library'],
        ['century', 4]
      ])
    });

    // 6. Canon Law
    this.addNode('node-canon-nicaea-1', {
      primaryName: 'Nicene Canon 1',
      arabicName: 'القانون الأول من قوانين مجمع نيقية',
      category: 'CanonLaw',
      language: 'Greek',
      historicalPeriod: '325 AD',
      confidenceScore: 1.0,
      authorityScore: 0.98,
      attributes: new Map<string, string | number | boolean | ReadonlyArray<string>>([
        ['canonNumber', 1],
        ['issuingBody', 'Nicaea I']
      ])
    });

    // Seed Edges
    this.addEdge('edge-1', 'node-father-athanasius', 'node-council-nicaea', {
      category: 'ParticipatedIn',
      label: 'Champion of Homoousios at Nicaea',
      arabicLabel: 'شارك كشماس ومدافع عن قانون الإيمان في نيقية',
      weight: 1.0,
      isDirectional: true,
      historicalEvidenceScore: 1.0,
      citations: ['Athanasius De Decretis 1'],
      properties: new Map()
    });

    this.addEdge('edge-2', 'node-council-nicaea', 'node-doctrine-homoousios', {
      category: 'ConfirmedBy',
      label: 'Promulgated Dogma of Homoousios',
      arabicLabel: 'أقر العقيدة والاصطلاح',
      weight: 1.0,
      isDirectional: true,
      historicalEvidenceScore: 1.0,
      citations: ['Nicene Creed 325 AD'],
      properties: new Map()
    });

    this.addEdge('edge-3', 'node-father-athanasius', 'node-biblical-john1', {
      category: 'ReferencedBy',
      label: 'Exegetical Defense in De Incarnatione',
      arabicLabel: 'تفسير واستشهاد كتابي في كتاب تجسد الكلمة',
      weight: 0.98,
      isDirectional: true,
      historicalEvidenceScore: 0.99,
      citations: ['De Incarnatione 1.1'],
      properties: new Map()
    });

    this.addEdge('edge-4', 'node-ms-vaticanus', 'node-biblical-john1', {
      category: 'TransmittedThrough',
      label: 'Preserves Codex Text of John 1:1',
      arabicLabel: 'يحفظ النص اليوناني لإنجيل يوحنا',
      weight: 0.98,
      isDirectional: true,
      historicalEvidenceScore: 0.99,
      citations: ['NT Textual Index'],
      properties: new Map()
    });

    this.addEdge('edge-5', 'node-council-nicaea', 'node-canon-nicaea-1', {
      category: 'PromulgatedAt',
      label: 'Promulgated Canon 1',
      arabicLabel: 'اصدار القانون الأول',
      weight: 1.0,
      isDirectional: true,
      historicalEvidenceScore: 1.0,
      citations: ['Mansi II, 668'],
      properties: new Map()
    });
  }
}
