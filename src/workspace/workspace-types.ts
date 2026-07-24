/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Workspace Domain Types & Data Model
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { UUID, ISO8601Timestamp } from '../foundation';

export type NoteType = 'academic' | 'wiki' | 'flashcard' | 'annotation' | 'summary';

export interface AcademicCitation {
  readonly citationId: UUID;
  readonly citeKey: string; // e.g. "Athanasius328"
  readonly author: string;
  readonly title: string;
  readonly year: number;
  readonly publication: string;
  readonly doiOrUri?: string;
}

export interface AcademicNoteRecord {
  readonly noteId: UUID;
  readonly projectId: UUID;
  readonly title: string;
  readonly contentMarkdown: string;
  readonly noteType: NoteType;
  readonly tags: ReadonlyArray<string>;
  readonly linkedNoteIds: ReadonlyArray<UUID>; // Bi-directional Backlinks
  readonly latexMathEquations: ReadonlyArray<string>;
  readonly citations: ReadonlyArray<AcademicCitation>;
  readonly createdTimestamp: ISO8601Timestamp;
  readonly lastModifiedTimestamp: ISO8601Timestamp;
}

export interface ResearchProjectRecord {
  readonly projectId: UUID;
  readonly nameArabic: string;
  readonly descriptionArabic: string;
  readonly academicDomain: 'patristics' | 'scripture' | 'canon_law' | 'manuscripts' | 'theology';
  readonly noteIds: ReadonlyArray<UUID>;
  readonly progressPercentage: number;
  readonly createdTimestamp: ISO8601Timestamp;
}

export interface ResearchTaskItem {
  readonly taskId: UUID;
  readonly projectId: UUID;
  readonly titleArabic: string;
  readonly isCompleted: boolean;
  readonly priority: 'high' | 'medium' | 'low';
  readonly dueDate?: ISO8601Timestamp;
}

export interface MindMapNode {
  readonly nodeId: string;
  readonly labelArabic: string;
  readonly children: ReadonlyArray<MindMapNode>;
}

export interface MindMapGraph {
  readonly mapId: UUID;
  readonly projectId: UUID;
  readonly rootNode: MindMapNode;
}

export interface ReadingListItem {
  readonly itemId: UUID;
  readonly title: string;
  readonly author: string;
  readonly libraryItemId?: UUID;
  readonly readingProgressPercentage: number;
  readonly status: 'unread' | 'reading' | 'completed';
}

export interface ResearchWorkspaceState {
  readonly activeProjectId?: UUID;
  readonly activeNoteId?: UUID;
  readonly totalNotesCount: number;
  readonly totalCitationsCount: number;
  readonly totalProjectsCount: number;
}
