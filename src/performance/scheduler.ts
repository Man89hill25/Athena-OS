/**
 * ==========================================================================================================
 * ATHENA X - PERFORMANCE ENGINE
 * Module: Task Priority Scheduler Engine (Idle Deadline & Frame Slicing)
 * 
 * Directive: DIRECTIVE 218 — ATHENA X PERFORMANCE ENGINE v1.0
 * Version: 1.0.0
 * Licensing: Proprietary Enterprise Standard 2045+
 * ==========================================================================================================
 */

import { Result } from '../foundation';

export type TaskPriority = 'high' | 'normal' | 'low' | 'background';

export class TaskScheduler {
  private queue: Array<{ priority: TaskPriority; taskFn: () => void }> = [];

  public scheduleTask(taskFn: () => void, priority: TaskPriority = 'normal'): Result<void, Error> {
    try {
      this.queue.push({ priority, taskFn });
      this.queue.sort((a, b) => {
        const order: Record<TaskPriority, number> = { high: 0, normal: 1, low: 2, background: 3 };
        return order[a.priority] - order[b.priority];
      });
      return Result.ok(undefined);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }

  public flushAllTasks(): Result<number, Error> {
    try {
      const count = this.queue.length;
      while (this.queue.length > 0) {
        const item = this.queue.shift();
        if (item) {
          item.taskFn();
        }
      }
      return Result.ok(count);
    } catch (err: unknown) {
      return Result.fail(err instanceof Error ? err : new Error(String(err)));
    }
  }
}
