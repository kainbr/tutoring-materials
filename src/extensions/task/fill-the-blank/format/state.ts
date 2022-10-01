import type {
  FTBFormatFunction,
  FTBContent,
  FTBState,
} from "@/extensions/task/fill-the-blank/types";
import { getDefaultTaskState } from "@/extensions/task/defaults";
import { findGaps } from "@/extensions/task/fill-the-blank/format/helpers";

export const formatState: FTBFormatFunction = function (data) {
  let answers;

  data.state = {
    ...getDefaultTaskState(data.id),
    ...data.state,
    type: "fill-the-blank",
    answer: (answers = formatAnswer(data.state, data.content)),
    empty: answers.every((a) => !a.value),
  };

  return data;
};

function formatAnswer(
  state: FTBState,
  content: FTBContent
): { id: string; value: string | null }[] {
  return findGaps(content).map((g) => {
    return {
      id: g.attrs?.id,
      value: state.answer?.find((a) => a.id === g.attrs?.id)?.value || null,
    };
  });
}
