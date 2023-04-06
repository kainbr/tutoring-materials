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
            :key="hint.id"
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

    <div class="flex w-full items-center basis-full justify-center mt-1" :class="{ 'basis-2/5 px-2': width > 500 }"
         v-if="!options.hideSubmitButton">
      <button
        v-if="['init', 'incorrect'].includes(state.state)"
        class="px-5 py-2 justify-center border shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
        type="button"
        :disabled="!options.allowEmptyAnswerSubmission && state.empty"
        @click="submit(state)"
      >
        {{ options.textSubmitButton }}
      </button>
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
    const { submit } = inject("submit") as InjectedSubmit;

    const hints: Ref<HintFeedback[]> = computed(() => {
      return (
        activeFeedbacks.value.filter(
          (s: Feedback) => s.type === "feedback-hint" && s.parent === props.id
        ) || []
      );
    }) as Ref<HintFeedback[]>;

    const backgroundColor = computed(() => {
      return {
        "p-3": props.state.state !== "init",
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
        "text-green-700": props.state.state === "correct",
        "text-yellow-700": props.state.state === "incorrect",
        "text-red-700": props.state.state === "final-incorrect"
      };
    });

    return {
      backgroundColor,
      fontColor,
      hints,
      title,
      titleColor,
      text,
      submit,
      width
    };
  }
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
