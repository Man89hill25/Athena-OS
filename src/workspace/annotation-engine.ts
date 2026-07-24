/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Digital Annotation & Text Marginalia Engine
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';

export interface TextAnnotation {
  readonly annotationId: UUID;
  readonly targetDocumentId: UUID;
  readonly startCharIndex: number;
  readonly endCharIndex: number;
  readonly selectedText: string;
  readonly marginaliaCommentArabic: string;
  readonly createdTimestamp: string;
}

export class AnnotationEngine {
  private annotations: Map<UUID, TextAnnotation> = new Map();

  public addAnnotation(
    targetDocumentId: UUID,
    startCharIndex: number,
    endCharIndex: number,
    selectedText: string,
    marginaliaCommentArabic: string
  ): Result<TextAnnotation, Error> {
    try {
      const annotationId = `annot-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const ann: TextAnnotation = {
        annotationId,
        targetDocumentId,
        startCharIndex,
        endCharIndex,
        selectedText,
        marginaliaCommentArabic,
        createdTimestamp: new Date().toISOString()
      };

      this.annotations.set(annotationId, ann);
      return Result.ok(ann);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getAnnotationsForDoc(docId: UUID): Result<ReadonlyArray<TextAnnotation>, Error> {
    try {
      const matches = Array.from(this.annotations.values()).filter(
        (a) => a.targetDocumentId === docId
      );
      return Result.ok(matches);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
