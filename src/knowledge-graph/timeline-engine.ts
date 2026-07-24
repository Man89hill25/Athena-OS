/**
 * ==========================================================================================================
 * ATHENA X - KNOWLEDGE GRAPH ENGINE
 * Module: Timeline Graph Engine (Chronological Sequencing & Anachronism Detection)
 * 
 * Directive: DIRECTIVE 211 — ATHENA X KNOWLEDGE GRAPH ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';
import { KnowledgeGraph } from './knowledge-graph';
import { GraphNode } from './graph-types';

export interface ChronologicalEventNode {
  readonly year: number;
  readonly node: GraphNode;
  readonly displayLabelArabic: string;
}

export interface AnachronismIssue {
  readonly sourceNode: GraphNode;
  readonly targetNode: GraphNode;
  readonly sourceYear: number;
  readonly targetYear: number;
  readonly issueArabic: string;
}

export class TimelineEngine {
  constructor(private graph: KnowledgeGraph) {}

  public buildChronologicalTimeline(): Result<ReadonlyArray<ChronologicalEventNode>, Error> {
    try {
      const nodes = this.graph.getAllNodes();
      const events: ChronologicalEventNode[] = [];

      for (const node of nodes) {
        let year: number | undefined;
        if (node.metadata.startYear !== undefined) {
          year = node.metadata.startYear;
        } else if (node.metadata.attributes.has('year')) {
          const y = node.metadata.attributes.get('year');
          if (typeof y === 'number') year = y;
        }

        if (year !== undefined) {
          events.push({
            year,
            node,
            displayLabelArabic: `[عام ${year} م] ${node.metadata.arabicName}`
          });
        }
      }

      events.sort((a, b) => a.year - b.year);
      return Result.ok(events);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public detectAnachronisms(): Result<ReadonlyArray<AnachronismIssue>, Error> {
    try {
      const edges = this.graph.getAllEdges();
      const issues: AnachronismIssue[] = [];

      for (const edge of edges) {
        const src = this.graph.getNode(edge.sourceId);
        const tgt = this.graph.getNode(edge.targetId);

        if (src && tgt && src.metadata.endYear !== undefined && tgt.metadata.startYear !== undefined) {
          if (edge.metadata.category === 'ParticipatedIn' && src.metadata.endYear < tgt.metadata.startYear) {
            issues.push({
              sourceNode: src,
              targetNode: tgt,
              sourceYear: src.metadata.endYear,
              targetYear: tgt.metadata.startYear,
              issueArabic: `خلل تسلسلي زمني: توفي الشخص ${src.metadata.arabicName} عام ${src.metadata.endYear} م قبل انعقاد المجمع ${tgt.metadata.arabicName} عام ${tgt.metadata.startYear} م.`
            });
          }
        }
      }

      return Result.ok(issues);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
