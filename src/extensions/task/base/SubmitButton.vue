<template>
  <div class="container rounded-lg" :class="backgroundColor">
    <!-- Container -->
    <div
      v-if="['correct', 'incorrect', 'final-incorrect'].includes(state.state)"
      class="flex justify-between transition"
    >
      <div class="flex flex-col">
        <div class="flex flex-row items-center">
          <span class="text-base font-medium" :class="titleColor">{{ title }}</span>
        </div>
        <div class="mt-1">
          <span class="text-sm" :class="fontColor">{{ text }}</span>
        </div>
      </div>
    </div>

    <!-- Button -->
    <button
      v-if="['init', 'incorrect'].includes(state.state)"
      class="mt-3 inline-flex items-center px-3 py-2 w-full justify-center border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      type="button"
      :disabled="!options.allowEmptyAnswerSubmission && state.isEmptyAnswer"
      @click="submit"
    >
      {{ options.textSubmitButton }}
    </button>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { evaluate } from "@/extensions/task/evaluate";

import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { TaskEvaluation, TaskOptions, TaskState } from "@/extensions/task/types";
import { calculateHexIcon } from "@/helpers/util";

export default defineComponent({
  name: "SubmitButton",

  props: {
    editor: {
      type: Object as PropType<Editor>,
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
      const response = await evaluate(this.type, this.evaluation, this.state);

      // Emit event
      this.editor.storage.document.eventBus().emit("answer-submitted", {
        parent: this.state.id,
        label: {
          message: "global.event.type-answer-submitted",
          hexIcon: calculateHexIcon(this.state.id),
        },
        data: {
          ...this.state,
          response,
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
