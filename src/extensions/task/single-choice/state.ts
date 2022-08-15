import type {
  SCFormatFunction,
  SCOption,
  SCOptionAnswer,
  SCOptions,
  SCState,
} from "@/tasks/single-choice/types";
import { getDefaultTaskState } from "@/tasks";

export const formatTaskState: SCFormatFunction<SCState> = function ({
  id,
  newContent,
  newState,
  newOptions,
  oldOptions,
  oldState,
}) {
  return {
    ...(!newState ? getDefaultTaskState(id) : newState),
    type: "single-choice",
    answer: formatAnswer(newState, newContent),
    order: formatOrder(newContent, newOptions, oldOptions, oldState),
    isEmptyAnswer: !newState || newState.answer.every((a) => !a.value),
  };
};

function formatAnswer(newState: SCState | null, newContent: SCOption[] | null): SCOptionAnswer[] {
  if (!!newContent && Array.isArray(newContent)) {
    return newContent.map((option: SCOption) => {
      return {
        id: option.id,
        value: !!newState?.answer?.find((o) => o.id === option.id)?.value,
      };
    });
  } else {
    return [];
  }
}

function formatOrder(
  newContent: SCOption[] | null,
  newOptions: SCOptions | null,
  oldOptions: SCOptions | null,
  oldState: SCState | null
): number[] {
  // If no content is given we cannot determine how long the order has to be
  if (!newContent) {
    return [];
  }

  if (
    !!newOptions &&
    !!oldOptions &&
    newOptions.shuffle === oldOptions.shuffle &&
    !!oldState &&
    newContent.length === oldState.order.length
  ) {
    return oldState.order;
  } else {
    if (newOptions?.shuffle) {
      return shuffleArray(Array.from([...Array(newContent?.length).keys()]));
    } else {
      return Array.from([...Array(newContent.length).keys()]);
    }
  }
}

function shuffleArray(a: number[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
