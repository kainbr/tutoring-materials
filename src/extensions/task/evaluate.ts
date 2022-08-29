import type { TaskEvaluation, TaskState } from "@/extensions/task/types";

export async function evaluate(taskType: string, config: TaskEvaluation, state: TaskState) {
  /* @vite-ignore */
  const functions = await import(`./${taskType}/evaluate.ts`);
  return {
    response: functions.evaluate(config, state),
    facts: functions.getFacts(config, state),
  };
}
