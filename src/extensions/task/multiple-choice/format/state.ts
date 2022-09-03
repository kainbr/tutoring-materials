import type {
  MCFormatFunction,
  MCOption,
  MCOptionAnswer,
  MCOptions,
  MCState,
} from "@/extensions/task/multiple-choice/types";
import { getDefaultTaskState } from "@/extensions/task/defaults";

export const formatState: MCFormatFunction = function (data) {
  let answers;

  data.state = {
    ...getDefaultTaskState(data.id),
    ...data.state,
    type: "multiple-choice",
    answer: (answers = formatAnswer(data.state, data.content)),
    order: formatOrder(data.content, data.options, data.state, data.oldOptions),
    empty: answers.every((a) => !a.value),
  };

  return data;
};

function formatAnswer(state: MCState, content: MCOption[]): MCOptionAnswer[] {
  return content.map((option: MCOption) => {
    return {
      id: option.id,
      value: !!state?.answer?.find((o) => o.id === option.id)?.value,
    };
  });
}

function formatOrder(
  content: MCOption[],
  options: MCOptions,
  state: MCState,
  oldOptions: MCOptions | undefined
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
