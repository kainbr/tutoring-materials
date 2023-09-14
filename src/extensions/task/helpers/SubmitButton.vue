<template>
  <div :class="backgroundColor" class="flex flex-row container rounded-lg items-start p-2">

    <Transition appear>
      <div
        class="mx-auto flex w-10 flex-shrink-0 items-center justify-center rounded-full"
      >
        <svg :class="fontColor" class="w-8 h-8 my-0 mx-2" fill="none" stroke="currentColor" stroke-width="1.5"
             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path v-if="['correct'].includes(state.state)" d="M4.5 12.75l6 6 9-13.5" stroke-linecap="round"
                stroke-linejoin="round" />
          <path v-if="['incorrect'].includes(state.state)" d="M15 15l6-6m0 0l-6-6m6 6H9a6 6 0 000 12h3"
                stroke-linecap="round"
                stroke-linejoin="round" />
          <path v-if="['final-incorrect'].includes(state.state)" d="M6 18L18 6M6 6l12 12" stroke-linecap="round"
                stroke-linejoin="round" />
        </svg>
      </div>
    </Transition>

    <!-- Headline -->
    <div :class="{ 'basis-3/5': width > 500 }" class="flex flex-col basis-full mx-1">
      <Transition appear>
        <span
          v-if="['correct', 'incorrect', 'final-incorrect'].includes(state.state)"
          class="font-medium"
          :class="titleColor"
        >
          {{ title }}
        </span>
      </Transition>
      <Transition appear>
        <div v-if="['incorrect'].includes(state.state)">
          <div
            v-for="hint in hints"
            :key="hint.id"
            :class="fontColor"
            class="w-fit"
          >
            <InlineEditor :content="hint.config.content"></InlineEditor>
          </div>
        </div>
      </Transition>
      <Transition appear>
        <div v-if="['correct', 'incorrect', 'final-incorrect'].includes(state.state)" class="">
          <span :class="fontColor">{{ text }}</span>
        </div>
      </Transition>
    </div>

    <div class="mt-2 flex flex-row gap-1 pr-2 items-center">

      <div
        v-if="disabledTimer > 0"
        class="inline-flex items-center justify-center overflow-hidden rounded-full bottom-5 left-5"
      >
        <!-- Building a Progress Ring: https://css-tricks.com/building-progress-ring-quickly/ -->
        <svg class="w-8 h-8">
          <circle
            class="text-gray-300"
            cx="16"
            cy="16"
            fill="transparent"
            r="12"
            stroke="currentColor"
            stroke-width="2.5"
          />
          <circle
            :stroke-dasharray="75.3982236862"
            :stroke-dashoffset="75.3982236862 - disabledTimer * 75.3982236862"
            class="text-blue-500"
            cx="16"
            cy="16"
            fill="transparent"
            r="12"
            stroke="currentColor"
            stroke-linecap="round"
            stroke-width="2.5"
          />
        </svg>
      </div>


      <!-- Check button -->
      <button
        v-if="!options.hideSubmitButton && ['init', 'incorrect'].includes(state.state) && !!options.maxAttempts"
        :disabled="(!options.allowEmptyAnswerSubmission && state.empty) || disabledTimer > 0"
        type="button"
        class="block w-full min-w-max justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white
        shadow-sm hover:bg-blue-500 sm:ml-1 sm:w-auto disabled:bg-blue-300 disabled:cursor-not-allowed whitespace-nowrap"
        @click="submit(state)"
      >
        <span>
          {{ options.textSubmitButton }}
        </span>
      </button>

      <!-- Feedback button -->
      <div
        v-if="['correct', 'final-incorrect'].includes(state.state) || (options.hasMaxAttempts && !options.maxAttempts)"
        class="flex flex-row">
        <button
          v-if="options.hasFeedbackButton"
          class="inline-flex flex-row items-center w-full justify-center rounded-md px-3 py-2 font-semibold text-gray-600
        hover:text-gray-800 sm:w-auto"
          type="button"
          @click="feedback()"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="1.5"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0
          016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0
          01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>

        <!-- Next button -->
        <button
          v-if="options.hasNextButton"
          :disabled="(!options.allowEmptyAnswerSubmission && state.empty) || disabledTimer > 0"
          class="block w-full min-w-max justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white
        shadow-sm hover:bg-blue-500 sm:ml-1 sm:w-auto disabled:bg-blue-300 disabled:cursor-not-allowed whitespace-nowrap"
          type="button"
          @click="next()"
        >
          <span class="w-full">Weiter</span>
        </button>
      </div>
    </div>
  </div>

</template>

<script lang="ts">
import { computed, defineComponent, inject } from "vue";
import InlineEditor from "@/helpers/InlineEditor.vue";

import type { Editor } from "@tiptap/vue-3";
import type { Feedback } from "@/extensions/feedback/types";
import type { HintFeedback } from "@/extensions/feedback/hint/types";
import type { InjectedContainerDimensions } from "@/helpers/useContainerDimensions";
import type { InjectedFeedbacks } from "@/helpers/useFeedbacks";
import type { PropType } from "vue";
import type { Ref } from "vue";
import type { TaskEvaluation, TaskOptions, TaskState } from "@/extensions/task/types";
import type { InjectedSubmit } from "@/extensions/task/base/TaskComponent.vue";

export default defineComponent({
  name: "SubmitButton",

  components: { InlineEditor },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    type: {
      type: String,
      required: true
    },
    options: {
      type: Object as PropType<TaskOptions>,
      required: true
    },
    evaluation: {
      type: Object as PropType<TaskEvaluation>,
      required: true
    },
    state: {
      type: Object as PropType<TaskState>,
      required: true
    }
  },

  setup(props) {
    const { activeFeedbacks } = inject("feedbacks") as InjectedFeedbacks;
    const { width } = inject("containerDimensions") as InjectedContainerDimensions;
    const { submit, next, feedback } = inject("submit") as InjectedSubmit;

    const hints: Ref<HintFeedback[]> = computed(() => {
      return (
        activeFeedbacks.value.filter(
          (s: Feedback) => s.type === "feedback-hint" && s.parent === props.id
        ) || []
      );
    }) as Ref<HintFeedback[]>;

    const backgroundColor = computed(() => {
      return {
        "bg-green-50": props.state.state === "correct",
        "bg-yellow-50": props.state.state === "incorrect",
        "bg-red-50": props.state.state === "final-incorrect"
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
        "text-red-800": props.state.state === "final-incorrect"
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
        "text-green-800": props.state.state === "correct",
        "text-yellow-800": props.state.state === "incorrect",
        "text-red-800": props.state.state === "final-incorrect"
      };
    });

    const disabledTimer = computed(() => {
      return props.state.disabledTimer;
    });

    return {
      backgroundColor,
      fontColor,
      hints,
      title,
      titleColor,
      text,
      submit,
      next,
      feedback,
      width,
      disabledTimer
    };
  }
});
</script>

<!--suppress CssUnusedSymbol -->
<style scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 1s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
