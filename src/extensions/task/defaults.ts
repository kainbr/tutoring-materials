import type { TaskOptions, TaskState } from "@/extensions/task/types";

export const defaultTaskOptions: TaskOptions = {
  allowEmptyAnswerSubmission: false,
  hasMaxAttempts: true,
  maxAttempts: 2,
  textSubmitButton: "Abschicken",
  titleCorrectAnswer: "Richtige Antwort",
  textCorrectAnswer: "Gute Arbeit!",
  titleIncorrectAnswer: "Falsche Antwort",
  textIncorrectAnswer: "Überprüfe deine Antwort noch einmal und versuche es erneut.",
  titleFinalIncorrectAnswer: "Falsche Antwort",
  textFinalIncorrectAnswer: "Sieh dir die richtige Antwort an.",
};

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
