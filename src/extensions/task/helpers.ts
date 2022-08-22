import { onMounted, watch } from "vue";
import type {
  formatFunction,
  TaskContent,
  TaskEmits,
  TaskEvaluation,
  TaskProps,
  TaskState,
} from "@/extensions/task/types";
import type { TaskOptions } from "@/extensions/task/types";
import { isEqual } from "lodash-es";
import type { StoredFeedback } from "@/extensions/feedback/types";

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

interface propsInterface<C, E, F, O, S> {
  id: string;
  newContent?: C;
  newEvaluation?: E;
  newFeedbacks?: F;
  newOptions?: O;
  newState?: S;
  oldContent?: C;
  oldEvaluation?: E;
  oldFeedbacks?: F;
  oldOptions?: O;
  oldState?: S;
}

export function formatTask<C, E, F, O, S, A extends TaskEmits>(
  data: propsInterface<C, E, F, O, S>,
  formatOptions: formatFunction<C, E, F, O, S, O>,
  formatContent: formatFunction<C, E, F, O, S, C>,
  formatTaskState: formatFunction<C, E, F, O, S, S>,
  formatEvaluation: formatFunction<C, E, F, O, S, E>,
  formatFeedbacks: formatFunction<C, E, F, O, S, F>,
  emit: A
): void {
  data.newOptions = formatOptions(data);
  data.newContent = formatContent(data);
  data.newEvaluation = formatEvaluation(data);
  data.newFeedbacks = formatFeedbacks(data);
  data.newState = formatTaskState(data);
  emit("update", {
    content: data.newContent,
    evaluation: data.newEvaluation,
    feedbacks: data.newFeedbacks,
    options: data.newOptions,
    state: data.newState,
  });
}

export function useTask<
  P extends TaskProps,
  A extends TaskEmits,
  C extends TaskContent,
  E extends TaskEvaluation,
  F extends StoredFeedback[],
  O extends TaskOptions,
  S extends TaskState
>(
  props: P,
  emit: A,
  formatOptions: formatFunction<C, E, F, O, S, O>,
  formatContent: formatFunction<C, E, F, O, S, C>,
  formatTaskState: formatFunction<C, E, F, O, S, S>,
  formatEvaluation: formatFunction<C, E, F, O, S, E>,
  formatFeedbacks: formatFunction<C, E, F, O, S, F>
): {
  updateContent: (newContent: C) => void;
  updateEvaluation: (newEvaluation: E) => void;
  updateFeedbacks: (newFeedbacks: F) => void;
  updateOptions: (newOptions: O) => void;
  updateState: (newState: S) => void;
} {
  const data = {
    id: props.id,
    newContent: props.content,
    newEvaluation: props.evaluation,
    newFeedbacks: props.feedbacks,
    newOptions: props.options,
    newState: props.state,
    oldContent: props.content,
    oldEvaluation: props.evaluation,
    oldFeedbacks: props.feedbacks,
    oldOptions: props.options,
    oldState: props.state,
  };

  const createFeedback = (feedback: StoredFeedback) => {
    if (!!props.feedbacks && Array.isArray(props.feedbacks)) {
      updateFeedbacks([...props.feedbacks, feedback]);
    } else {
      updateFeedbacks([feedback]);
    }
  };

  const updateFeedback = (feedback: StoredFeedback, attributes: Partial<StoredFeedback>) => {
    if (!!props.feedbacks) {
      updateFeedbacks(
        props.feedbacks.map((f: StoredFeedback) =>
          f.id === feedback.id ? { ...f, ...attributes } : f
        )
      );
    }
  };

  const removeFeedback = (feedback: StoredFeedback) => {
    if (!!props.feedbacks) {
      updateFeedbacks(props.feedbacks.filter((f: StoredFeedback) => f.id !== feedback.id));
    }
  };

  onMounted(() => {
    formatTask<C, E, F, O, S, A>(
      <propsInterface<C, E, F, O, S>>{
        ...data,
        oldContent: undefined,
        oldEvaluation: undefined,
        oldFeedbacks: undefined,
        oldOptions: undefined,
        oldState: undefined,
      },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      emit
    );
  });

  // Watch for external changes
  watch(
    [
      () => <C | undefined>props.content,
      () => <E | undefined>props.evaluation,
      () => <F | undefined>props.feedbacks,
      () => <O | undefined>props.options,
      () => <S | undefined>props.state,
    ],
    (
      [newContent, newEvaluation, newFeedbacks, newOptions, newState],
      [oldContent, oldEvaluation, oldFeedbacks, oldOptions, oldState]
    ) => {
      if (
        !isEqual(newContent, oldContent) ||
        !isEqual(newEvaluation, oldEvaluation) ||
        !isEqual(newFeedbacks, oldFeedbacks) ||
        !isEqual(newOptions, oldOptions) ||
        !isEqual(newState, oldState)
      ) {
        formatTask<C, E, F, O, S, A>(
          <propsInterface<C, E, F, O, S>>{
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
      }
    },
    {
      deep: true,
    }
  );

  // Format on internal changes
  const updateContent = (newContent: C): void => {
    formatTask<C, E, F, O, S, A>(
      { ...data, newContent: <C>newContent },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      emit
    );
  };
  const updateEvaluation = (newEvaluation: E): void => {
    formatTask<C, E, F, O, S, A>(
      { ...data, newEvaluation: <E>newEvaluation },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      emit
    );
  };
  const updateFeedbacks = (newFeedbacks: F): void => {
    formatTask<C, E, F, O, S, A>(
      { ...data, newFeedbacks: <F>newFeedbacks },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      emit
    );
  };
  const updateOptions = (newOptions: O): void => {
    formatTask<C, E, F, O, S, A>(
      { ...data, newOptions: <O>newOptions },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      emit
    );
  };
  const updateState = (newState: S): void => {
    formatTask<C, E, F, O, S, A>(
      { ...data, newState: <S>newState },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      emit
    );
  };

  return { updateContent, updateEvaluation, updateFeedbacks, updateOptions, updateState };
}
