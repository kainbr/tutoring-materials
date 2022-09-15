import type {
  TFFormatFunction,
  TFOption,
  TFOptionAnswer,
  TFOptions,
  TFState,
} from "@/extensions/task/true-false/types";
import { getDefaultTaskState } from "@/extensions/task/defaults";

export const formatState: TFFormatFunction = function (data) {
  let answers;

  data.state = {
    ...getDefaultTaskState(data.id),
    ...data.state,
    type: "true-false",
    answer: (answers = formatAnswer(data.state, data.content)),
    order: formatOrder(data.content, data.options, data.state, data.oldOptions),
    empty: answers.some((a) => a.value === null),
  };

  return data;
};

function formatAnswer(state: TFState, content: TFOption[]): TFOptionAnswer[] {
  return content.map((option: TFOption) => {
    const value = state?.answer?.find((o) => o.id === option.id)?.value;
    if (typeof value === "undefined") {
      return {
        id: option.id,
        value: null,
      };
    } else {
      return {
        id: option.id,
        value,
      };
    }
  });
}

function formatOrder(
  content: TFOption[],
  options: TFOptions,
  state: TFState,
  oldOptions: TFOptions | undefined
): number[] {
  if (!options.shuffle) {
    return Array.from([...Array(content.length).keys()]);
  }

  if (options.shuffle && !!oldOptions?.shuffle && content.length === state.order.length) {
    return state.order;
  }

  return shuffleArray(Array.from([...Array(content.length).keys()]));
}

function shuffleArray(a: number[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
