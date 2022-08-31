import type { TaskState } from "@/extensions/task/types";

export function getDefaultTaskState(id: string): TaskState {
  return {
    id: id,
    state: "init",
    attempt: 1,
    answer: undefined,
    empty: true,
    type: "",
  };
}
