<template>
  <div class="flex flex-row flex-wrap container rounded-lg items-center" :class="backgroundColor">
    <!-- Headline -->
    <div class="flex flex-col justify-between basis-3/4">
      <Transition appear>
        <span
          v-if="['correct', 'incorrect', 'final-incorrect'].includes(state.state)"
          class="text-base font-medium"
          :class="titleColor"
          >{{ title }}</span
        >
      </Transition>
      <Transition appear>
        <div v-if="['correct', 'incorrect', 'final-incorrect'].includes(state.state)" class="mt-1">
          <span class="text-sm" :class="fontColor">{{ text }}</span>
        </div>
      </Transition>
      <Transition appear>
        <div v-if="['incorrect'].includes(state.state)">
          <span v-for="hint in hints" :key="hint" :class="fontColor" class="not-prose">
            <InlineEditor :content="hint.config.content"></InlineEditor>
          </span>
        </div>
      </Transition>
    </div>

    <div class="grow w-36">
      <button
        v-if="['init', 'incorrect'].includes(state.state)"
        class="inline-flex items-center mt-3 px-3 py-2 w-full justify-center border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
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
import { defineComponent } from "vue";
import { evaluate } from "@/extensions/task/evaluate";
import { calculateHexIcon } from "@/helpers/util";

import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { TaskEvaluation, TaskOptions, TaskState } from "@/extensions/task/types";
import type { Feedback } from "@/extensions/feedback/types";
import InlineEditor from "@/helpers/InlineEditor.vue";

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

  computed: {
    hints() {
      return (
        this.editor.storage.feedbacks.active.filter(
          (s: Feedback) => s.type === "feedback-hint" && s.parent === this.id
        ) || []
      );
    },
    backgroundColor() {
      return {
        "p-3": this.state.state !== "init",
        "bg-green-50": this.state.state === "correct",
        "bg-yellow-50": this.state.state === "incorrect",
        "bg-red-50": this.state.state === "final-incorrect",
      };
    },
    title() {
      switch (this.state.state) {
        case "correct":
          return this.options.titleCorrectAnswer;
        case "incorrect":
          return this.options.titleIncorrectAnswer;
        case "final-incorrect":
          return this.options.titleFinalIncorrectAnswer;
        default:
          return "title-correct-answer";
      }
    },
    titleColor() {
      return {
        "text-green-800": this.state.state === "correct",
        "text-yellow-800": this.state.state === "incorrect",
        "text-red-800": this.state.state === "final-incorrect",
      };
    },
    text() {
      switch (this.state.state) {
        case "correct":
          return this.options.textCorrectAnswer;
        case "incorrect":
          return this.options.textIncorrectAnswer;
        case "final-incorrect":
          return this.options.textFinalIncorrectAnswer;
        default:
          return "text-correct-answer";
      }
    },
    fontColor() {
      return {
        "text-green-700": this.state.state === "correct",
        "text-yellow-700": this.state.state === "incorrect",
        "text-red-700": this.state.state === "final-incorrect",
      };
    },
  },

  methods: {
    /**
     * Evaluate the response and determine the next state of the task
     * Possible values are: correct, incorrect and final-incorrect
     */
    async submit() {
      // Evaluate answer
      const { response, facts } = await evaluate(this.type, this.evaluation, this.state);

      // Emit event
      this.editor.storage.document.eventBus().emit("answer-submitted", {
        type: this.type,
        parent: this.state.id,
        facts: {
          attempt: this.state.attempt,
          empty: this.state.empty,
          response,
          ...facts,
        },
        data: {
          ...this.state,
          response,
        },
        label: {
          message: "global.event.type-answer-submitted",
          hexIcon: calculateHexIcon(this.state.id),
        },
      });

      // Set the next state depending on the result and the configuration of the task
      if (response) {
        this.editor.commands.updateTaskState(this.state, { ...this.state, state: "correct" });
      } else {
        if (this.options.hasMaxAttempts && this.state.attempt >= this.options.maxAttempts) {
          this.editor.commands.updateTaskState(this.state, {
            ...this.state,
            state: "final-incorrect",
          });
        } else {
          this.editor.commands.updateTaskState(this.state, {
            ...this.state,
            state: "incorrect",
            attempt: this.state.attempt + 1,
          });
        }
      }
    },
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
