<template>
  <div class="flex flex-row flex-wrap container rounded-lg" :class="backgroundColor">
    <!-- Headline -->
    <div class="flex flex-col basis-full" :class="{ 'basis-3/5': width > 500 }">
      <Transition appear>
        <span
          v-if="['correct', 'incorrect', 'final-incorrect'].includes(state.state)"
          class="text-base font-medium"
          :class="titleColor"
          >{{ title }}</span
        >
      </Transition>
      <Transition appear>
        <div v-if="['incorrect'].includes(state.state)">
          <div
            v-for="hint in hints"
            :key="hint"
            :class="fontColor"
            class="not-prose text-sm mt-0.5"
          >
            <InlineEditor :content="hint.config.content"></InlineEditor>
          </div>
        </div>
      </Transition>
      <Transition appear>
        <div v-if="['correct', 'incorrect', 'final-incorrect'].includes(state.state)" class="">
          <span class="text-sm" :class="fontColor">{{ text }}</span>
        </div>
      </Transition>
    </div>

    <div class="flex items-center basis-full" :class="{ 'basis-2/5 px-2': width > 500 }">
      <button
        v-if="['init', 'incorrect'].includes(state.state)"
        class="inline-flex items-center w-full mt-3 px-3 py-2 justify-center border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        type="button"
        :disabled="!options.allowEmptyAnswerSubmission && state.empty"
        @click="submit"
      >
        {{ options.textSubmitButton }}
      </button>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject } from "vue";
import { evaluate } from "@/extensions/task/evaluate";
import { calculateHexIcon } from "@/helpers/util";
import InlineEditor from "@/helpers/InlineEditor.vue";

import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { TaskEvaluation, TaskOptions, TaskState } from "@/extensions/task/types";
import type { Feedback } from "@/extensions/feedback/types";

export default defineComponent({
  name: "SubmitButton",

  components: { InlineEditor },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    id: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    options: {
      type: Object as PropType<TaskOptions>,
      required: true,
    },
    evaluation: {
      type: Object as PropType<TaskEvaluation>,
      required: true,
    },
    state: {
      type: Object as PropType<TaskState>,
      required: true,
    },
  },

  setup(props) {
    const hints = computed(() => {
      return (
        props.editor.storage.feedbacks.active.filter(
          (s: Feedback) => s.type === "feedback-hint" && s.parent === props.id
        ) || []
      );
    });

    const backgroundColor = computed(() => {
      return {
        "p-3": props.state.state !== "init",
        "bg-green-50": props.state.state === "correct",
        "bg-yellow-50": props.state.state === "incorrect",
        "bg-red-50": props.state.state === "final-incorrect",
      };
    });

    const title = computed(() => {
      switch (props.state.state) {
        case "correct":
          return props.options.titleCorrectAnswer;
        case "incorrect":
          return props.options.titleIncorrectAnswer;
        case "final-incorrect":
          return props.options.titleFinalIncorrectAnswer;
        default:
          return "title-correct-answer";
      }
    });

    const titleColor = computed(() => {
      return {
        "text-green-800": props.state.state === "correct",
        "text-yellow-800": props.state.state === "incorrect",
        "text-red-800": props.state.state === "final-incorrect",
      };
    });

    const text = computed(() => {
      switch (props.state.state) {
        case "correct":
          return props.options.textCorrectAnswer;
        case "incorrect":
          return props.options.textIncorrectAnswer;
        case "final-incorrect":
          return props.options.textFinalIncorrectAnswer;
        default:
          return "text-correct-answer";
      }
    });

    const fontColor = computed(() => {
      return {
        "text-green-700": props.state.state === "correct",
        "text-yellow-700": props.state.state === "incorrect",
        "text-red-700": props.state.state === "final-incorrect",
      };
    });

    /**
     * Evaluate the response and determine the next state of the task
     * Possible values are: correct, incorrect and final-incorrect
     */
    const submit = async () => {
      // Evaluate answer
      const { response, facts } = await evaluate(props.type, props.evaluation, props.state);

      // Emit event
      props.editor.storage.document.eventBus().emit("answer-submitted", {
        type: props.type,
        parent: props.state.id,
        facts: {
          attempt: props.state.attempt,
          empty: props.state.empty,
          response,
          ...facts,
        },
        data: {
          ...props.state,
          response,
        },
        label: {
          message: "global.event.type-answer-submitted",
          hexIcon: calculateHexIcon(props.state.id),
        },
      });

      // Set the next state depending on the result and the configuration of the task
      if (response) {
        props.editor.commands.updateTaskState(props.state, { ...props.state, state: "correct" });
      } else {
        if (props.options.hasMaxAttempts && props.state.attempt >= props.options.maxAttempts) {
          props.editor.commands.updateTaskState(props.state, {
            ...props.state,
            state: "final-incorrect",
          });
        } else {
          props.editor.commands.updateTaskState(props.state, {
            ...props.state,
            state: "incorrect",
            attempt: props.state.attempt + 1,
          });
        }
      }
    };

    return {
      hints,
      backgroundColor,
      title,
      titleColor,
      text,
      fontColor,
      submit,
      width: inject("width") as number,
    };
  },
});
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
