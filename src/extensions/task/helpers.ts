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
  options?: O;
  content?: C;
  evaluation?: E;
  state?: S;
  feedbacks?: StoredFeedback[];
  triggers?: EventTrigger[];
  oldOptions?: O;
  oldContent?: C;
  oldEvaluation?: E;
  oldState?: S;
  oldFeedbacks?: StoredFeedback[];
  oldTriggers?: EventTrigger[];
};

export function formatTask<O, C, E, S>(
  data: propsInterface<O, C, E, S>,
  formatFunctions: ((data: propsInterface<O, C, E, S>) => propsInterface<O, C, E, S>)[]
): propsInterface<O, C, E, S> {
  formatFunctions.forEach(
    (formatFunction: (data: propsInterface<O, C, E, S>) => propsInterface<O, C, E, S>) => {
      data = formatFunction(data);
    }
  );
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
  formatFunctions: ((data: propsInterface<O, C, E, S>) => propsInterface<O, C, E, S>)[]
): {
  update: (attributes: Partial<propsInterface<O, C, E, S>>) => void;
  updateOptions: (options: O) => void;
  updateContent: (content: C) => void;
  updateEvaluation: (evaluation: E) => void;
  updateState: (state: S) => void;
  updateFeedbacks: (feedbacks: StoredFeedback[]) => void;
  updateTriggers: (triggers: EventTrigger[]) => void;
  createFeedback: (feedback: StoredFeedback) => void;
  updateFeedback: (feedback: StoredFeedback, attributes: Partial<StoredFeedback>) => void;
  removeFeedback: (feedback: StoredFeedback) => void;
} {
  const data: propsInterface<O, C, E, S> = {
    id: props.id,
    options: props.options,
    content: props.content,
    evaluation: props.evaluation,
    state: props.state,
    feedbacks: props.feedbacks,
    triggers: props.triggers,
    oldOptions: props.options,
    oldContent: props.content,
    oldEvaluation: props.evaluation,
    oldState: props.state,
    oldFeedbacks: props.feedbacks,
    oldTriggers: props.triggers,
  };

  onMounted(() => {
    const newData = formatTask<O, C, E, S>(
      {
        ...data,
        oldOptions: undefined,
        oldContent: undefined,
        oldEvaluation: undefined,
        oldState: undefined,
        oldFeedbacks: undefined,
        oldTriggers: undefined,
      },
      formatFunctions
    );
    emit("update", {
      options: newData.options,
      content: newData.content,
      evaluation: newData.evaluation,
      state: newData.state,
      feedbacks: newData.feedbacks,
      triggers: newData.triggers,
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
      [options, content, evaluation, state, feedbacks, triggers],
      [oldOptions, oldContent, oldEvaluation, oldState, oldFeedbacks, oldTriggers]
    ) => {
      if (
        !isEqual(options, oldOptions) ||
        !isEqual(content, oldContent) ||
        !isEqual(evaluation, oldEvaluation) ||
        !isEqual(state, oldState) ||
        !isEqual(feedbacks, oldFeedbacks) ||
        !isEqual(triggers, oldTriggers)
      ) {
        const newData = formatTask<O, C, E, S>(
          <propsInterface<O, C, E, S>>{
            id: props.id,
            options,
            content,
            evaluation,
            feedbacks,
            state,
            triggers,
            oldOptions,
            oldContent,
            oldEvaluation,
            oldState,
            oldFeedbacks,
            oldTriggers,
          },
          formatFunctions
        );
        emit("update", {
          options: newData.options,
          content: newData.content,
          evaluation: newData.evaluation,
          state: newData.state,
          feedbacks: newData.feedbacks,
          triggers: newData.triggers,
        });
      }
    },
    {
      deep: true,
    }
  );

  // Format on internal changes
  const update = (attributes: Partial<propsInterface<O, C, E, S>>): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        options: props.options,
        content: props.content,
        evaluation: props.evaluation,
        state: props.state,
        feedbacks: props.feedbacks,
        triggers: props.triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
        ...attributes,
      },
      formatFunctions
    );
    emit("update", {
      options: newData.options,
      content: newData.content,
      evaluation: newData.evaluation,
      state: newData.state,
      feedbacks: newData.feedbacks,
      triggers: newData.triggers,
    });
  };

  // Format on internal changes
  const updateOptions = (options: O): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        options: options,
        content: props.content,
        evaluation: props.evaluation,
        state: props.state,
        feedbacks: props.feedbacks,
        triggers: props.triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatFunctions
    );
    emit("update", {
      options: newData.options,
      content: newData.content,
      evaluation: newData.evaluation,
      state: newData.state,
      feedbacks: newData.feedbacks,
      triggers: newData.triggers,
    });
  };

  const updateContent = (content: C): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        options: props.options,
        content: content,
        evaluation: props.evaluation,
        state: props.state,
        feedbacks: props.feedbacks,
        triggers: props.triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatFunctions
    );
    emit("update", {
      options: newData.options,
      content: newData.content,
      evaluation: newData.evaluation,
      state: newData.state,
      feedbacks: newData.feedbacks,
      triggers: newData.triggers,
    });
  };

  const updateEvaluation = (evaluation: E): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        options: props.options,
        content: props.content,
        evaluation: evaluation,
        state: props.state,
        feedbacks: props.feedbacks,
        triggers: props.triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatFunctions
    );
    emit("update", {
      options: newData.options,
      content: newData.content,
      evaluation: newData.evaluation,
      state: newData.state,
      feedbacks: newData.feedbacks,
      triggers: newData.triggers,
    });
  };

  const updateState = (state: S): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        options: props.options,
        content: props.content,
        evaluation: props.evaluation,
        state: state,
        feedbacks: props.feedbacks,
        triggers: props.triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatFunctions
    );
    emit("update", {
      options: newData.options,
      content: newData.content,
      evaluation: newData.evaluation,
      state: newData.state,
      feedbacks: newData.feedbacks,
      triggers: newData.triggers,
    });
  };

  const updateFeedbacks = (feedbacks: StoredFeedback[]): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        options: props.options,
        content: props.content,
        evaluation: props.evaluation,
        state: props.state,
        feedbacks: feedbacks,
        triggers: props.triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatFunctions
    );
    emit("update", {
      options: newData.options,
      content: newData.content,
      evaluation: newData.evaluation,
      state: newData.state,
      feedbacks: newData.feedbacks,
      triggers: newData.triggers,
    });
  };

  const updateTriggers = (triggers: EventTrigger[]): void => {
    const newData = formatTask<O, C, E, S>(
      {
        id: props.id,
        options: props.options,
        content: props.content,
        evaluation: props.evaluation,
        state: props.state,
        feedbacks: props.feedbacks,
        triggers: triggers,
        oldOptions: props.options,
        oldContent: props.content,
        oldEvaluation: props.evaluation,
        oldState: props.state,
        oldFeedbacks: props.feedbacks,
        oldTriggers: props.triggers,
      },
      formatFunctions
    );
    emit("update", {
      options: newData.options,
      content: newData.content,
      evaluation: newData.evaluation,
      state: newData.state,
      feedbacks: newData.feedbacks,
      triggers: newData.triggers,
    });
  };

  const createFeedback = (feedback: StoredFeedback) => {
    updateFeedbacks([...(!!props.feedbacks ? props.feedbacks : []), feedback]);
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
    update,
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
