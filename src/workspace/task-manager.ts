/**
 * ==========================================================================================================
 * ATHENA X - RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK
 * Module: Academic Task & Research Milestone Manager
 * 
 * Directive: DIRECTIVE 215 — ATHENA X RESEARCH WORKSPACE & KNOWLEDGE NOTEBOOK v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result, UUID } from '../foundation';
import { ResearchTaskItem } from './workspace-types';

export class TaskManagerEngine {
  private tasks: Map<UUID, ResearchTaskItem> = new Map();

  public createTask(
    projectId: UUID,
    titleArabic: string,
    priority: 'high' | 'medium' | 'low' = 'medium',
    dueDate?: string
  ): Result<ResearchTaskItem, Error> {
    try {
      const taskId = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      const task: ResearchTaskItem = {
        taskId,
        projectId,
        titleArabic,
        isCompleted: false,
        priority,
        dueDate
      };

      this.tasks.set(taskId, task);
      return Result.ok(task);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public completeTask(taskId: UUID): Result<ResearchTaskItem, Error> {
    try {
      const task = this.tasks.get(taskId);
      if (!task) {
        return Result.fail(new Error(`Task ${taskId} not found.`));
      }

      const updated: ResearchTaskItem = { ...task, isCompleted: true };
      this.tasks.set(taskId, updated);
      return Result.ok(updated);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public getTasksForProject(projectId: UUID): Result<ReadonlyArray<ResearchTaskItem>, Error> {
    try {
      const projectTasks = Array.from(this.tasks.values()).filter((t) => t.projectId === projectId);
      return Result.ok(projectTasks);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
