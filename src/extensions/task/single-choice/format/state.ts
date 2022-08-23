import type {
  SCFormatFunction,
  SCOption,
  SCOptionAnswer,
  SCOptions,
  SCState,
} from "@/extensions/task/single-choice/types";
import { getDefaultTaskState } from "@/extensions/task/defaults";

export const formatState: SCFormatFunction = function (data) {
  const state: Partial<SCState> = <Partial<SCState>>{
    ...getDefaultTaskState(data.id),
    ...data.state,
  };

  state.type = "single-choice";
  state.answer = formatAnswer(data.state, data.content);
  state.order = formatOrder(data.content, data.options, data.oldOptions, data.oldState);
  state.empty = state.answer.every((a) => !a.value);

  data.state = <SCState>state;

  return data;
};

function formatAnswer(
  state: SCState | undefined,
  content: SCOption[] | undefined
): SCOptionAnswer[] {
  if (!!content && Array.isArray(content)) {
    return content.map((option: SCOption) => {
      return {
        id: option.id,
        value: !!state?.answer?.find((o) => o.id === option.id)?.value,
      };
    });
  } else {
    return [];
  }
}

function formatOrder(
  content: SCOption[] | undefined,
  options: SCOptions | undefined,
  oldOptions: SCOptions | undefined,
  oldState: SCState | undefined
): number[] {
  // If no content is given we cannot determine how long the order has to be
  if (!content) {
    return [];
  }

  if (
    !!options &&
    !!oldOptions &&
    options.shuffle === oldOptions.shuffle &&
    !!oldState &&
    content.length === oldState.order.length
  ) {
    return oldState.order;
  } else {
    if (options?.shuffle) {
      return shuffleArray(Array.from([...Array(content?.length).keys()]));
    } else {
      return Array.from([...Array(content.length).keys()]);
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
