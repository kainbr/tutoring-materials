import type { TaskEvaluation, TaskState } from "@/extensions/task/types";

export async function evaluate(taskType: string, config: TaskEvaluation, state: TaskState) {
  /* @vite-ignore */
  return (await import(`./${taskType}/evaluate.ts`)).evaluate(config, state);
}
