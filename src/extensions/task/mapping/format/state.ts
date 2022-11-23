import type {
  MAPContent,
  MAPFormatFunction,
  MAPOptionAnswer,
  MAPState,
} from "@/extensions/task/mapping/types";
import { getDefaultTaskState } from "@/extensions/task/defaults";

export const formatState: MAPFormatFunction = function (data) {
  let answers;

  data.state = {
    ...getDefaultTaskState(data.id),
    ...data.state,
    type: "mapping",
    answer: (answers = formatAnswer(data.state, data.content)),
    empty: answers.some((a) => !a.target),
  };

  return data;
};

function formatAnswer(state: MAPState, content: MAPContent): MAPOptionAnswer[] {
  return content.source.map((o) => {
    return {
      source: o.id,
      target: state.answer?.find((a) => a.source === o.id)?.target || null,
    };
  });
}
