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
    empty: answers.length === 0,
  };

  return data;
};

function formatAnswer(state: MAPState, content: MAPContent): MAPOptionAnswer[] {
  return (
    state.answer?.filter(
      (solution) =>
        !!solution.source &&
        !!content.source.find((o) => o.id === solution.source) &&
        !!solution.target &&
        !!content.target.find((o) => o.id === solution.target)
    ) || []
  );
}
