import type { TaskEvaluation, TaskState } from "@/tasks/types";

export async function evaluate(taskType: string, config: TaskEvaluation, state: TaskState) {
  /* @vite-ignore */
  return (await import(`./${taskType.substring(5)}/evaluate.ts`)).evaluate(config, state);
}
