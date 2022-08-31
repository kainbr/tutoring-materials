import { isEqual } from "lodash-es";
import { onMounted, watch } from "vue";

import type { DocumentState } from "@/extensions/document/types";
import type { Editor, JSONContent } from "@tiptap/vue-3";
import type { Feedback } from "@/extensions/feedback/types";
import type { Ref } from "vue";
import type { SetupContext } from "vue";
import type { TaskState } from "@/extensions/task/types";

export default function (
  editor: Editor,
  taskStates: Ref<TaskState[]>,
  props: { isEditor: boolean; content: JSONContent; state: DocumentState },
  context: SetupContext<("update:content" | "update:state" | "event")[]>
) {
  onMounted(() => {
    context.emit("update:state", {
      tasks: taskStates.value,
      feedbacks: editor.storage.feedbacks.active,
    });
  });

  watch(
    () => props.content,
    (content) => {
      if (!isEqual(content, editor.getJSON())) {
        if (!content) {
          content = {
            type: "doc",
            content: [
              {
                type: "document",
                content: [
                  {
                    type: "paragraph",
                  },
                ],
              },
            ],
          };
        }
        editor.commands.setContent(content, true);
      }
    },
    { deep: true }
  );

  watch(
    () => props.state.tasks,
    (tasks) => {
      if (!isEqual(tasks, taskStates.value)) {
        taskStates.value = tasks;
      }
    },
    { deep: true }
  );

  watch(
    () => props.state.feedbacks,
    (feedbacks) => {
      if (!isEqual(feedbacks, editor.storage.feedbacks.active)) {
        // editor.storage.feedbacks.active = feedbacks;
        const feedbackIds = feedbacks.map((feedback: Feedback) => feedback.id);

        editor.storage.feedbacks.active
          .filter((feedback: Feedback) => !feedbackIds.includes(feedback.id))
          .forEach((feedback: Feedback) => {
            editor.commands.removeActiveFeedback(feedback);
          });

        feedbacks.forEach((feedback: Feedback) => {
          editor.commands.addActiveFeedback(feedback);
        });
      }
    },
    { deep: true }
  );

  watch(
    [() => taskStates.value, () => editor.storage.feedbacks.active],
    ([states, feedbacks], [oldStates, oldFeedbacks]) => {
      if (!isEqual(states, oldStates) || !isEqual(feedbacks, oldFeedbacks)) {
        context.emit("update:state", {
          tasks: states,
          feedbacks: feedbacks,
        });

        editor.setOptions({
          editorProps: {
            attributes: {
              style: editor.storage["feedback-mark"].getStyleVariables(),
              class: "h-full",
            },
          },
        });
      }
    },
    { deep: true }
  );
}
