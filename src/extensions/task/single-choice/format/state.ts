import type {
  SCFormatFunction,
  SCOption,
  SCOptionAnswer,
  SCOptions,
  SCState,
} from "@/extensions/task/single-choice/types";
import { getDefaultTaskState } from "@/extensions/task/defaults";

export const formatState: SCFormatFunction = function (data) {
  let answers;

  data.state = {
    ...getDefaultTaskState(data.id),
    ...data.state,
    type: "single-choice",
    answer: (answers = formatAnswer(data.state, data.content)),
    order: formatOrder(data.content, data.options, data.state, data.oldOptions),
    empty: answers.every((a) => !a.value),
  };

  return data;
};

function formatAnswer(state: SCState, content: SCOption[]): SCOptionAnswer[] {
  return content.map((option: SCOption) => {
    return {
      id: option.id,
      value: !!state?.answer?.find((o) => o.id === option.id)?.value,
    };
  });
}

function formatOrder(
  content: SCOption[],
  options: SCOptions,
  state: SCState,
  oldOptions: SCOptions | undefined
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
