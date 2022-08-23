import { isEqual, pick } from "lodash-es";
import { onMounted, watch } from "vue";

import type {
  TaskContent,
  TaskEmits,
  TaskEvaluation,
  TaskProps,
  TaskState,
} from "@/extensions/task/types";
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
): { update: (attributes: Partial<propsInterface<O, C, E, S>>) => void } {
  const getData = (props: P): propsInterface<O, C, E, S> => {
    return {
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
  };

  onMounted(() => {
    const newData = formatTask<O, C, E, S>(
      {
        ...getData(props),
        oldOptions: undefined,
        oldContent: undefined,
        oldEvaluation: undefined,
        oldState: undefined,
        oldFeedbacks: undefined,
        oldTriggers: undefined,
      },
      formatFunctions
    );
    emit(
      "update",
      pick(newData, ["options", "content", "evaluation", "state", "feedbacks", "triggers"])
    );
  });

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
        if (
          !isEqual(options, newData.options) ||
          !isEqual(content, newData.content) ||
          !isEqual(evaluation, newData.evaluation) ||
          !isEqual(state, newData.state) ||
          !isEqual(feedbacks, newData.feedbacks) ||
          !isEqual(triggers, newData.triggers)
        ) {
          emit(
            "update",
            pick(newData, ["options", "content", "evaluation", "state", "feedbacks", "triggers"])
          );
        }
      }
    },
    {
      deep: true,
    }
  );

  const update = (attributes: Partial<propsInterface<O, C, E, S>>): void => {
    const newData = formatTask<O, C, E, S>(
      {
        ...getData(props),
        ...attributes,
      },
      formatFunctions
    );
    emit(
      "update",
      pick(newData, ["options", "content", "evaluation", "state", "feedbacks", "triggers"])
    );
  };

  return { update };
}
