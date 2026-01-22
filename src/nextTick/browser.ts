interface SchedulerPostTaskOptions {
  priority?: "user-blocking" | "user-visible" | "background";
  delay?: number;
  signal?: AbortSignal;
}

interface Scheduler {
  postTask<T>(callback: () => T | Promise<T>, options?: SchedulerPostTaskOptions): Promise<T>;

  yield?(): Promise<void>;
}

declare global {
  const scheduler: Scheduler | undefined;
}

/**
 * Continues with the callback on the next tick.
 */
export const nextTick: (callback: () => void) => unknown =
  typeof scheduler === "object" && typeof scheduler.postTask === "function"
    ? scheduler.postTask.bind(scheduler)
    : setTimeout;
