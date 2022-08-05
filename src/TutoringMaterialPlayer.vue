<template>
  <TutoringMaterial
    :content="content"
    :state="state"
    @update:state="$emit('update:state', $event)"
    @event="$emit('event', $event)"
  ></TutoringMaterial>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TutoringMaterial from "@/TutoringMaterial.vue";
import type { PropType } from "vue";
import type { JSONContent } from "@tiptap/vue-3";

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

    state: {
      type: Object,
      default() {
        return undefined;
      },
    },
  },

  emits: ["update:state", "event"],
});
</script>
