<template>
  <div class="flex flex-col w-full w-full">
    <div v-if="!editor.isEditable" class="my-1 w-full">
      <slot name="render" />
    </div>

    <div v-if="editor.isEditable" class="my-1 w-full">
      <slot name="content" />
    </div>

    <div v-if="editor.isEditable" class="my-1 w-full">
      <details>
        <summary class="cursor-pointer">{{ $t("editor.task.title-evaluation") }}</summary>
        <slot name="evaluation" />
      </details>
    </div>

    <div v-if="editor.isEditable" class="my-1 w-full">
      <details>
        <summary class="cursor-pointer">{{ $t("editor.task.title-feedbacks") }}</summary>
        <slot name="feedbacks" />
        <FeedbackListComponent
          :editor="editor"
          :feedbacks="feedbacks"
          :create-feedback="(feedback) => createFeedback(feedback)"
          :update-feedback="(feedback, attributes) => updateFeedback(feedback, attributes)"
          :remove-feedback="(feedback) => removeFeedback(feedback)"
        />
      </details>
    </div>

    <div v-if="editor.isEditable" class="my-1 w-full">
      <details>
        <summary class="cursor-pointer">{{ $t("editor.task.title-triggers") }}</summary>
        <slot name="triggers" />
      </details>
    </div>

    <div v-if="editor.isEditable" class="my-1 w-full">
      <details>
        <summary class="cursor-pointer">{{ $t("editor.task.title-options") }}</summary>
        <slot name="options" />
      </details>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { Feedback } from "@/extensions/feedback/types";
import FeedbackListComponent from "@/extensions/feedback/FeedbackListComponent.vue";

export default defineComponent({
  name: "TaskScaffold",

  components: {
    FeedbackListComponent,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    feedbacks: {
      type: Array as PropType<Feedback[]>,
      required: true,
    },
    update: {
      type: Function,
      required: true,
    },
  },

  methods: {
    createFeedback(feedback: Feedback) {
      this.update({ feedbacks: [...(!!this.feedbacks ? this.feedbacks : []), feedback] });
    },

    updateFeedback(feedback: Feedback, attributes: Partial<Feedback>) {
      if (!!this.feedbacks) {
        this.update({
          feedbacks: this.feedbacks.map((f: Feedback) =>
            f.id === feedback.id ? { ...f, ...attributes } : f
          ),
        });
      }
    },

    removeFeedback(feedback: Feedback) {
      if (!!this.feedbacks) {
        this.update({
          feedbacks: this.feedbacks.filter((f: Feedback) => f.id !== feedback.id),
        });
      }
    },
  },
});
</script>
