<template>
  <TutoringMaterial
    :content="content"
    :state="state"
    :is-editor="isEditor"
    :task-limit="taskLimit"
    @update:content="$emit('update:content', $event)"
    @update:state="updateState"
  ></TutoringMaterial>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TutoringMaterial from "@/TutoringMaterial.vue";
import type { PropType } from "vue";
import type { JSONContent } from "@tiptap/vue-3";
import type { TaskState } from "@/extensions/task/types";
import type { Feedback } from "@/extensions/feedback/types";

export default defineComponent({
  name: "TutoringMaterialEditor",

  components: {
    TutoringMaterial,
  },

  props: {
    content: {
      type: Object as PropType<JSONContent>,
      default() {
        return {
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
      },
    },

    isEditor: {
      type: Boolean,
      default: false,
    },

    taskLimit: {
      type: Number,
      default: -1,
    },
  },

  emits: ["update:content"],

  data() {
    return {
      state: undefined as { tasks: TaskState[]; feedbacks: Feedback[] } | undefined,
    };
  },

  methods: {
    updateState($event: { tasks: TaskState[]; feedbacks: Feedback[] }) {
      this.state = { ...$event };
    },
  },
});
</script>
