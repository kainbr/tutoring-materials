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
          type: "tutoring-material",
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
      state: undefined,
    };
  },

  methods: {
    updateState($event) {
      this.state = { ...$event };
    },
  },
});
</script>
