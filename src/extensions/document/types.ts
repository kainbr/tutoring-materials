import type { TaskState } from "@/extensions/task/base/types";
import type { Feedback } from "@/extensions/feedback/types";

export interface DocumentState {
  tasks: TaskState[];
  feedbacks: Feedback[];
}
