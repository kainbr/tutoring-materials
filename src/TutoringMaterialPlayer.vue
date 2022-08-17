<template>
  <TutoringMaterial
    :content="content"
    :state="state"
    @update:state="$emit('update:state', $event)"
    @event="emitState"
  ></TutoringMaterial>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TutoringMaterial from "@/TutoringMaterial.vue";
import type { PropType } from "vue";
import type { JSONContent } from "@tiptap/vue-3";
import type { DocumentState } from "@/extensions/document/types";

export default defineComponent({
  name: "TutoringMaterialPlayer",

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

    state: {
      type: Object as PropType<DocumentState>,
      default() {
        return {};
      },
    },
  },

  emits: ["update:state", "event"],

  methods: {
    emitState($event) {
      this.$emit("event", $event);
    },
  },
});
</script>
