import { onMounted, watch } from "vue";
import type { formatFunction, TaskEmits, TaskProps, TaskState } from "@/extensions/task/types";
import type { TaskOptions } from "@/extensions/task/types";
import { isEqual } from "lodash-es";
import { calculateHexIcon } from "@/helpers/util";

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
  currentStateStore: S,
  emit: A
): void {
  data.newOptions = formatOptions(data);
  if (!isEqual(data.newOptions, data.oldOptions)) {
    emit("update:options", data.newOptions);
  }

  data.newContent = formatContent(data);
  if (!isEqual(data.newContent, data.oldContent)) {
    emit("update:content", data.newContent);
  }

  data.newEvaluation = formatEvaluation(data);
  if (!isEqual(data.newEvaluation, data.oldEvaluation)) {
    emit("update:evaluation", data.newEvaluation);
  }

  data.newFeedbacks = formatFeedbacks(data);
  if (!isEqual(data.newFeedbacks, data.oldFeedbacks)) {
    emit("update:feedbacks", data.newFeedbacks);
  }

  data.newState = formatTaskState(data);
  if (!isEqual(data.newState, data.oldState) && !isEqual(data.newState, currentStateStore)) {
    emit("update:state", data.newState);
  }
}

export function useTask<P extends TaskProps, A extends TaskEmits, C, E, F, O, S>(
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
  console.log("useTask called");

  // Prevent that formatting is performed twice after the onMounted hook
  let justInitialized = true;

  // Format content on initial load
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
      props.editor.storage.task.taskStates.find((ts: TaskState) => ts.id === props.id),
      emit
    );
  });

  // Watch for external changes
  watch(
    [
      () => <C | null>props.content,
      () => <E | null>props.evaluation,
      () => <F | null>props.feedbacks,
      () => <O | null>props.options,
      () => <S | null>props.state,
      () => props.editor.storage.task.taskStates.find((ts: TaskState) => ts.id === props.id),
    ],
    (
      [newContent, newEvaluation, newFeedbacks, newOptions, newState, newStateStore],
      [oldContent, oldEvaluation, oldFeedbacks, oldOptions, oldState, oldStateStore]
    ) => {
      if (justInitialized) {
        props.editor.storage.document.eventBus().emit("task-created", {
          parent: props.id,
          label: {
            message: "global.event.type-task-created",
            hexIcon: calculateHexIcon(props.id),
          },
          data: {
            id: props.id,
            content: props.content,
            evaluation: props.evaluation,
            feedbacks: props.feedbacks,
            options: props.options,
            state: props.state,
          },
        });
      }

      if (
        !justInitialized &&
        (!isEqual(newContent, oldContent) ||
          !isEqual(newEvaluation, oldEvaluation) ||
          !isEqual(newFeedbacks, oldFeedbacks) ||
          !isEqual(newOptions, oldOptions) ||
          !isEqual(newState, oldState) ||
          !isEqual(newStateStore, oldStateStore))
      ) {
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
          newStateStore,
          emit
        );
      } else {
        justInitialized = false;
      }
    },
    { deep: true }
  );

  // Format on internal changes
  const updateContent = (newContent: C): void => {
    formatTask<C, E, F, O, S, A>(
      {
        id: props.id,
        newContent: <C>newContent,
        newEvaluation: <E>props.evaluation,
        newFeedbacks: <F>props.feedbacks,
        newOptions: <O>props.options,
        newState: <S>props.state,
        oldContent: <C>props.content,
        oldEvaluation: <E>props.evaluation,
        oldFeedbacks: <F>props.feedbacks,
        oldOptions: <O>props.options,
        oldState: <S>props.state,
      },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      props.editor.storage.task.taskStates.find((ts: TaskState) => ts.id === props.id),
      emit
    );
  };
  const updateEvaluation = (newEvaluation: E): void => {
    formatTask<C, E, F, O, S, A>(
      {
        id: props.id,
        newContent: <C>props.content,
        newEvaluation: <E>newEvaluation,
        newFeedbacks: <F>props.feedbacks,
        newOptions: <O>props.options,
        newState: <S>props.state,
        oldContent: <C>props.content,
        oldEvaluation: <E>props.evaluation,
        oldFeedbacks: <F>props.feedbacks,
        oldOptions: <O>props.options,
        oldState: <S>props.state,
      },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      props.editor.storage.task.taskStates.find((ts: TaskState) => ts.id === props.id),
      emit
    );
  };
  const updateFeedbacks = (newFeedbacks: F): void => {
    formatTask<C, E, F, O, S, A>(
      {
        id: props.id,
        newContent: <C>props.content,
        newEvaluation: <E>props.evaluation,
        newFeedbacks: <F>newFeedbacks,
        newOptions: <O>props.options,
        newState: <S>props.state,
        oldContent: <C>props.content,
        oldEvaluation: <E>props.evaluation,
        oldFeedbacks: <F>props.feedbacks,
        oldOptions: <O>props.options,
        oldState: <S>props.state,
      },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      props.editor.storage.task.taskStates.find((ts: TaskState) => ts.id === props.id),
      emit
    );
  };
  const updateOptions = (newOptions: O): void => {
    formatTask<C, E, F, O, S, A>(
      {
        id: props.id,
        newContent: <C>props.content,
        newEvaluation: <E>props.evaluation,
        newFeedbacks: <F>props.feedbacks,
        newOptions: <O>newOptions,
        newState: <S>props.state,
        oldContent: <C>props.content,
        oldEvaluation: <E>props.evaluation,
        oldFeedbacks: <F>props.feedbacks,
        oldOptions: <O>props.options,
        oldState: <S>props.state,
      },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      props.editor.storage.task.taskStates.find((ts: TaskState) => ts.id === props.id),
      emit
    );
  };
  const updateState = (newState: S): void => {
    formatTask<C, E, F, O, S, A>(
      {
        id: props.id,
        newContent: <C>props.content,
        newEvaluation: <E>props.evaluation,
        newFeedbacks: <F>props.feedbacks,
        newOptions: <O>props.options,
        newState: <S>newState,
        oldContent: <C>props.content,
        oldEvaluation: <E>props.evaluation,
        oldFeedbacks: <F>props.feedbacks,
        oldOptions: <O>props.options,
        oldState: <S>props.state,
      },
      formatOptions,
      formatContent,
      formatTaskState,
      formatEvaluation,
      formatFeedbacks,
      props.editor.storage.task.taskStates.find((ts: TaskState) => ts.id === props.id),
      emit
    );
  };

  return { updateContent, updateEvaluation, updateFeedbacks, updateOptions, updateState };
}
