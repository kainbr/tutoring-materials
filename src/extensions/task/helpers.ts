import { onMounted, watch } from "vue";
import type {
  TaskContent,
  TaskEmits,
  TaskEvaluation,
  TaskProps,
  TaskState,
} from "@/extensions/task/types";
import { isEqual } from "lodash-es";
import type { TaskOptions } from "@/extensions/task/types";
import type { EventTrigger, StoredFeedback } from "@/extensions/feedback/types";

export type propsInterface<O, C, E, S> = {
  id: string;
  newOptions?: O;
  newContent?: C;
  newEvaluation?: E;
  newState?: S;
  newFeedbacks?: StoredFeedback[];
  newTriggers?: EventTrigger[];
  oldOptions?: O;
  oldContent?: C;
  oldEvaluation?: E;
  oldState?: S;
  oldFeedbacks?: StoredFeedback[];
  oldTriggers?: EventTrigger[];
};

export function formatTask<O, C, E, S>(
  data: propsInterface<O, C, E, S>,
  formatOptions: (data: propsInterface<O, C, E, S>) => O,
  formatContent: (data: propsInterface<O, C, E, S>) => C,
  formatEvaluation: (data: propsInterface<O, C, E, S>) => E,
  formatState: (data: propsInterface<O, C, E, S>) => S,
  formatFeedbacks: (data: propsInterface<O, C, E, S>) => StoredFeedback[],
  formatTriggers: (data: propsInterface<O, C, E, S>) => EventTrigger[]
): propsInterface<O, C, E, S> {
  data.newOptions = formatOptions(data);
  data.newContent = formatContent(data);
  data.newEvaluation = formatEvaluation(data);
  data.newState = formatState(data);
  data.newFeedbacks = formatFeedbacks(data);
  data.newTriggers = formatTriggers(data);
  return data;
}

export function useTask<
  P extends TaskProps<O, C, E, S>,
  A extends TaskEmits<O, C, E, S>,
  O extends TaskOptions,
  C extends TaskContent,
  E extends TaskEvaluation,
  S extends TaskState
>(
  props: P,
  emit: A,
  formatOptions: (data: propsInterface<O, C, E, S>) => O,
  formatContent: (data: propsInterface<O, C, E, S>) => C,
  formatEvaluation: (data: propsInterface<O, C, E, S>) => E,
  formatState: (data: propsInterface<O, C, E, S>) => S,
  formatFeedbacks: (data: propsInterface<O, C, E, S>) => StoredFeedback[],
  formatTriggers: (data: propsInterface<O, C, E, S>) => EventTrigger[]
): {
  updateOptions: (newOptions: O) => void;
  updateContent: (newContent: C) => void;
  updateEvaluation: (newEvaluation: E) => void;
  updateState: (newState: S) => void;
  updateFeedbacks: (newFeedbacks: StoredFeedback[]) => void;
  updateTriggers: (newTriggers: EventTrigger[]) => void;
  createFeedback: (feedback: StoredFeedback) => void;
  updateFeedback: (feedback: StoredFeedback, attributes: Partial<StoredFeedback>) => void;
  removeFeedback: (feedback: StoredFeedback) => void;
} {
  const data: propsInterface<O, C, E, S> = {
    id: props.id,
    newOptions: props.options,
    newContent: props.content,
    newEvaluation: props.evaluation,
    newState: props.state,
    newFeedbacks: props.feedbacks,
    newTriggers: props.triggers,
    oldOptions: props.options,
    oldContent: props.content,
    oldEvaluation: props.evaluation,
    oldState: props.state,
    oldFeedbacks: props.feedbacks,
    oldTriggers: props.triggers,
  };

  onMounted(() => {
    const newData = formatTask<O, C, E, S>(
      <propsInterface<O, C, E, S>>{
        ...data,
        oldOptions: undefined,
        oldContent: undefined,
        oldEvaluation: undefined,
        oldState: undefined,
        oldFeedbacks: undefined,
        oldTriggers: undefined,
      },
      formatOptions,
      formatContent,
      formatEvaluation,
      formatState,
      formatFeedbacks,
      formatTriggers
    );
    emit("update", {
      options: newData.newOptions,
      content: newData.newContent,
      evaluation: newData.newEvaluation,
      state: newData.newState,
      feedbacks: newData.newFeedbacks,
      triggers: newData.newTriggers,
    });
  });

  // Watch for external changes
  watch(
    [
      () => props.options,
      () => props.content,
      () => props.evaluation,
      () => props.state,
      () => props.feedbacks,
      () => props.triggers,
    ],
    (
      [newOptions, newContent, newEvaluation, newState, newFeedbacks, newTriggers],
      [oldOptions, oldContent, oldEvaluation, oldState, oldFeedbacks, oldTriggers]
    ) => {
      if (
        !isEqual(newOptions, oldOptions) ||
        !isEqual(newContent, oldContent) ||
        !isEqual(newEvaluation, oldEvaluation) ||
        !isEqual(newState, oldState) ||
        !isEqual(newFeedbacks, oldFeedbacks) ||
        !isEqual(newTriggers, oldTriggers)
      ) {
        const newData = formatTask<O, C, E, S>(
          <propsInterface<O, C, E, S>>{
            id: props.id,
            newOptions,
            newContent,
            newEvaluation,
            newFeedbacks,
            newState,
            newTriggers,
            oldOptions,
            oldContent,
            oldEvaluation,
            oldState,
            oldFeedbacks,
            oldTriggers,
          },
          formatOptions,
          formatContent,
          formatEvaluation,
          formatState,
          formatFeedbacks,
          formatTriggers
        );
        emit("update", {
          options: newData.newOptions,
          content: newData.newContent,
          evaluation: newData.newEvaluation,
          state: newData.newState,
          feedbacks: newData.newFeedbacks,
          triggers: newData.newTriggers,
        });
      }
    },
    {
      deep: true,
    }
  );

  // Format on internal changes
  const updateOptions = (newOptions: O): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        newOptions: newOptions,
        newContent: props.content,
        newEvaluation: props.evaluation,
        newState: props.state,
        newFeedbacks: props.feedbacks,
        newTriggers: props.triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatOptions,
      formatContent,
      formatEvaluation,
      formatState,
      formatFeedbacks,
      formatTriggers
    );
    emit("update", {
      options: newData.newOptions,
      content: newData.newContent,
      evaluation: newData.newEvaluation,
      state: newData.newState,
      feedbacks: newData.newFeedbacks,
      triggers: newData.newTriggers,
    });
  };

  const updateContent = (newContent: C): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        newOptions: props.options,
        newContent: newContent,
        newEvaluation: props.evaluation,
        newState: props.state,
        newFeedbacks: props.feedbacks,
        newTriggers: props.triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatOptions,
      formatContent,
      formatEvaluation,
      formatState,
      formatFeedbacks,
      formatTriggers
    );
    emit("update", {
      options: newData.newOptions,
      content: newData.newContent,
      evaluation: newData.newEvaluation,
      state: newData.newState,
      feedbacks: newData.newFeedbacks,
      triggers: newData.newTriggers,
    });
  };

  const updateEvaluation = (newEvaluation: E): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        newOptions: props.options,
        newContent: props.content,
        newEvaluation: newEvaluation,
        newState: props.state,
        newFeedbacks: props.feedbacks,
        newTriggers: props.triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatOptions,
      formatContent,
      formatEvaluation,
      formatState,
      formatFeedbacks,
      formatTriggers
    );
    emit("update", {
      options: newData.newOptions,
      content: newData.newContent,
      evaluation: newData.newEvaluation,
      state: newData.newState,
      feedbacks: newData.newFeedbacks,
      triggers: newData.newTriggers,
    });
  };

  const updateState = (newState: S): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        newOptions: props.options,
        newContent: props.content,
        newEvaluation: props.evaluation,
        newState: newState,
        newFeedbacks: props.feedbacks,
        newTriggers: props.triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatOptions,
      formatContent,
      formatEvaluation,
      formatState,
      formatFeedbacks,
      formatTriggers
    );
    emit("update", {
      options: newData.newOptions,
      content: newData.newContent,
      evaluation: newData.newEvaluation,
      state: newData.newState,
      feedbacks: newData.newFeedbacks,
      triggers: newData.newTriggers,
    });
  };

  const updateFeedbacks = (newFeedbacks: StoredFeedback[]): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        newOptions: props.options,
        newContent: props.content,
        newEvaluation: props.evaluation,
        newState: props.state,
        newFeedbacks: newFeedbacks,
        newTriggers: props.triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatOptions,
      formatContent,
      formatEvaluation,
      formatState,
      formatFeedbacks,
      formatTriggers
    );
    emit("update", {
      options: newData.newOptions,
      content: newData.newContent,
      evaluation: newData.newEvaluation,
      state: newData.newState,
      feedbacks: newData.newFeedbacks,
      triggers: newData.newTriggers,
    });
  };

  const updateTriggers = (newTriggers: EventTrigger[]): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        newOptions: props.options,
        newContent: props.content,
        newEvaluation: props.evaluation,
        newState: props.state,
        newFeedbacks: props.feedbacks,
        newTriggers: newTriggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatOptions,
      formatContent,
      formatEvaluation,
      formatState,
      formatFeedbacks,
      formatTriggers
    );
    emit("update", {
      options: newData.newOptions,
      content: newData.newContent,
      evaluation: newData.newEvaluation,
      state: newData.newState,
      feedbacks: newData.newFeedbacks,
      triggers: newData.newTriggers,
    });
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

  return {
    updateOptions,
    updateContent,
    updateEvaluation,
    updateState,
    updateFeedbacks,
    updateTriggers,
    createFeedback,
    updateFeedback,
    removeFeedback,
  };
}
