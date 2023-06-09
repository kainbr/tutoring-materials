import type {
  STFormatFunction
} from "@/extensions/task/short-text/types";
import { getDefaultTaskState } from "@/extensions/task/defaults";

export const formatState: STFormatFunction = function(data) {

  let answer;

  data.state = {
    ...getDefaultTaskState(data.id),
    ...data.state,
    type: "short-text",
    answer: (answer = data.state.answer),
    empty: !answer
  };

  return data;
};
