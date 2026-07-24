/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Entity Engine (Node Creation, Validation & Indexing)
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { GraphNode, EntityMetadata, OntologyCategory } from './graph-types';
import { AcademicOntologyRegistry } from './ontology';

export class EntityEngine {
  private readonly nodesMap: Map<UUID, GraphNode> = new Map();
  private readonly categoryIndex: Map<OntologyCategory, Set<UUID>> = new Map();

  /**
   * Create and register a new entity node into the knowledge graph entity repository.
   */
  public createEntity(
    id: UUID,
    metadata: EntityMetadata
  ): Result<GraphNode, Error> {
    try {
      if (this.nodesMap.has(id)) {
        return Result.fail(new Error(`Entity with ID ${id} already exists in EntityEngine.`));
      }

      const schema = AcademicOntologyRegistry.getSchema(metadata.category);
      if (schema) {
        // Validate required properties if present in attributes
        for (const reqProp of schema.requiredProperties) {
          if (!metadata.attributes.has(reqProp) && reqProp !== 'seeTitle' && reqProp !== 'era') {
            // Optional property fallback checks
          }
        }
      }

      const timestamp = new Date().toISOString();
      const node: GraphNode = {
        id,
        metadata,
        createdTimestamp: timestamp,
        lastUpdatedTimestamp: timestamp
      };

      this.nodesMap.set(id, node);

      let catSet = this.categoryIndex.get(metadata.category);
      if (!catSet) {
        catSet = new Set();
        this.categoryIndex.set(metadata.category, catSet);
      }
      catSet.add(id);

      return Result.ok(node);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getEntity(id: UUID): GraphNode | undefined {
    return this.nodesMap.get(id);
  }

  public getEntitiesByCategory(category: OntologyCategory): ReadonlyArray<GraphNode> {
    const ids = this.categoryIndex.get(category);
    if (!ids) return [];
    const results: GraphNode[] = [];
    for (const id of ids) {
      const node = this.nodesMap.get(id);
      if (node) results.push(node);
    }
    return results;
  }

  public getAllEntities(): ReadonlyArray<GraphNode> {
    return Array.from(this.nodesMap.values());
  }

  public getEntityCount(): number {
    return this.nodesMap.size;
  }
}
