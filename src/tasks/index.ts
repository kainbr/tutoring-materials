import { onMounted, watch } from "vue";
import type { formatFunction, TaskEmits, TaskProps, TaskState } from "@/tasks/types";
import type { TaskOptions } from "@/tasks/types";

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
    isEmptyAnswer: true,
    type: "",
  };
}

interface dataInterface<C, E, F, O, S> {
  id: string;
  newContent: C | null;
  newEvaluation: E | null;
  newFeedbacks: F | null;
  newOptions: O | null;
  newState: S | null;
  oldContent: C | null;
  oldEvaluation: E | null;
  oldFeedbacks: F | null;
  oldOptions: O | null;
  oldState: S | null;
}

export function formatTask<C, E, F, O, S, A extends TaskEmits>(
  data: dataInterface<C, E, F, O, S>,
  formatOptions: formatFunction<C, E, F, O, S, O>,
  formatContent: formatFunction<C, E, F, O, S, C>,
  formatTaskState: formatFunction<C, E, F, O, S, S>,
  formatEvaluation: formatFunction<C, E, F, O, S, E>,
  formatFeedbacks: formatFunction<C, E, F, O, S, F>,
  emit: A
): void {
  data.newOptions = formatOptions(data);
  if (JSON.stringify(data.newOptions) !== JSON.stringify(data.oldOptions)) {
    emit("update:options", data.newOptions);
  }

  data.newContent = formatContent(data);
  if (JSON.stringify(data.newContent) !== JSON.stringify(data.oldContent)) {
    emit("update:content", data.newContent);
  }

  data.newState = formatTaskState(data);
  if (JSON.stringify(data.newState) !== JSON.stringify(data.oldState)) {
    emit("update:state", data.newState);
  }

  data.newEvaluation = formatEvaluation(data);
  if (JSON.stringify(data.newEvaluation) !== JSON.stringify(data.oldEvaluation)) {
    emit("update:evaluation", data.newEvaluation);
  }

  data.newFeedbacks = formatFeedbacks(data);
  if (JSON.stringify(data.newFeedbacks) !== JSON.stringify(data.oldFeedbacks)) {
    emit("update:feedbacks", data.newFeedbacks);
  }
}

export function initializeTask<P extends TaskProps, A extends TaskEmits, C, E, F, O, S>(
  props: P,
  emit: A,
  formatOptions: formatFunction<C, E, F, O, S, O>,
  formatContent: formatFunction<C, E, F, O, S, C>,
  formatTaskState: formatFunction<C, E, F, O, S, S>,
  formatEvaluation: formatFunction<C, E, F, O, S, E>,
  formatFeedbacks: formatFunction<C, E, F, O, S, F>
): void {
  // Prevent that formatting is performed twice after the onMounted hook
  let justInitialized = true;

  watch(
    [
      () => <C | null>props.content,
      () => <E | null>props.evaluation,
      () => <F | null>props.feedbacks,
      () => <O | null>props.options,
      () => <S | null>props.state,
    ],
    (
      [newContent, newEvaluation, newFeedbacks, newOptions, newState],
      [oldContent, oldEvaluation, oldFeedbacks, oldOptions, oldState]
    ) => {
      if (!justInitialized) {
        formatTask<C, E, F, O, S, A>(
          {
            id: props.id,
            newContent,
            newEvaluation,
            newFeedbacks,
            newOptions,
            newState,
            oldContent,
            oldEvaluation,
            oldFeedbacks,
            oldOptions,
            oldState,
          },
          formatOptions,
          formatContent,
          formatTaskState,
          formatEvaluation,
          formatFeedbacks,
          emit
        );
      } else {
        justInitialized = false;
      }
    },
    { deep: true }
  );

  onMounted(() => {
    formatTask<C, E, F, O, S, A>(
      {
        id: props.id,
        newContent: <C | null>props.content,
        newEvaluation: <E | null>props.evaluation,
        newFeedbacks: <F | null>props.feedbacks,
        newOptions: <O | null>props.options,
        newState: <S | null>props.state,
        oldContent: null,
        oldEvaluation: null,
        oldFeedbacks: null,
        oldOptions: null,
        oldState: null,
      },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      emit
    );
  });
}
