import type {
  SCFormatFunction,
  SCOption,
  SCOptionAnswer,
  SCOptions,
  SCState,
} from "@/extensions/task/single-choice/types";
import { getDefaultTaskState } from "@/extensions/task/defaults";

export const formatState: SCFormatFunction = function (data) {
  const newState: Partial<SCState> = <Partial<SCState>>{
    ...getDefaultTaskState(data.id),
    ...data.newState,
  };

  newState.type = "single-choice";
  newState.answer = formatAnswer(data.newState, data.newContent);
  newState.order = formatOrder(data.newContent, data.newOptions, data.oldOptions, data.oldState);
  newState.empty = newState.answer.every((a) => !a.value);

  data.newState = <SCState>newState;

  return data;
};

function formatAnswer(
  newState: SCState | undefined,
  newContent: SCOption[] | undefined
): SCOptionAnswer[] {
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
  newContent: SCOption[] | undefined,
  newOptions: SCOptions | undefined,
  oldOptions: SCOptions | undefined,
  oldState: SCState | undefined
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
