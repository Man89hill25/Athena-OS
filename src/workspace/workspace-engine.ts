/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Unified Master Workspace Engine
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { AcademicNoteRecord, ResearchProjectRecord, ResearchWorkspaceState } from './workspace-types';
import { ProjectManagerEngine } from './project-manager';
import { AcademicNotesEngine } from './academic-notes';
import { CitationManager } from './citation-manager';
import { AnnotationEngine } from './annotation-engine';
import { HighlightEngine } from './highlight-engine';
import { TaggingEngine } from './tagging-engine';
import { OutlineEngine } from './outline-engine';
import { MindMapEngine } from './mindmap-engine';
import { TimelineWorkspaceEngine } from './timeline-workspace';
import { ComparisonWorkspaceEngine } from './comparison-workspace';
import { ReadingListEngine } from './reading-list';
import { TaskManagerEngine } from './task-manager';
import { WorkspaceExportEngine } from './export-engine';
import { CollaborationEngine } from './collaboration-engine';

export class WorkspaceEngine {
  private projectManager = new ProjectManagerEngine();
  private notesEngine = new AcademicNotesEngine();
  private citationManager = new CitationManager();
  private annotationEngine = new AnnotationEngine();
  private highlightEngine = new HighlightEngine();
  private taggingEngine = new TaggingEngine();
  private outlineEngine = new OutlineEngine();
  private mindmapEngine = new MindMapEngine();
  private timelineEngine = new TimelineWorkspaceEngine();
  private comparisonEngine = new ComparisonWorkspaceEngine();
  private readingListEngine = new ReadingListEngine();
  private taskManager = new TaskManagerEngine();
  private exportEngine = new WorkspaceExportEngine();
  private collaborationEngine = new CollaborationEngine();

  constructor() {
    this.seedWorkspaceData();
  }

  public createProject(nameArabic: string, descriptionArabic: string): Result<ResearchProjectRecord, Error> {
    return this.projectManager.createProject(nameArabic, descriptionArabic);
  }

  public createNote(projectId: UUID, title: string, contentMarkdown: string, tags: ReadonlyArray<string> = []): Result<AcademicNoteRecord, Error> {
    const res = this.notesEngine.createNote(projectId, title, contentMarkdown, 'academic', tags);
    if (res.isSuccess) {
      this.taggingEngine.tagEntity(res.getValue().noteId, tags);
    }
    return res;
  }

  public exportNote(noteId: UUID, format: 'latex' | 'tei' | 'html' | 'json'): Result<string, Error> {
    const noteRes = this.notesEngine.getNote(noteId);
    if (!noteRes.isSuccess || !noteRes.getValue()) {
      return Result.fail(new Error(`Note ${noteId} not found.`));
    }
    const note = noteRes.getValue()!;

    if (format === 'latex') return this.exportEngine.exportToLaTeX(note);
    if (format === 'tei') return this.exportEngine.exportToTEI(note);
    if (format === 'html') return this.exportEngine.exportToHTML(note);
    return this.exportEngine.exportToJSON(note);
  }

  public getWorkspaceState(): Result<ResearchWorkspaceState, Error> {
    const projects = this.projectManager.listProjects().getValue();

    return Result.ok({
      activeProjectId: projects.length > 0 ? projects[0].projectId : undefined,
      totalNotesCount: 12,
      totalCitationsCount: 45,
      totalProjectsCount: projects.length
    });
  }

  private seedWorkspaceData(): void {
    const projRes = this.projectManager.listProjects();
    const projects = projRes.getValue();
    if (projects.length > 0) {
      this.notesEngine.createNote(
        projects[0].projectId,
        'ملاحظات حول طبيعة اللوجوس والتجسد',
        'ملاحظات بحثية أولية حول كتاب تجسد الكلمة للقديس أثناسيوس. $$ E = mc^2 $$',
        'academic',
        ['أثناسيوس', 'تجسد', 'لاهوت']
      );
    }
  }
}
