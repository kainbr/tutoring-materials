<template>
  <span>
    <!-- eslint-disable vue/no-v-html -->
    <span v-if="label.hexIcon" class="px-1" v-html="label.hexIcon" />
    {{ compiledLabel }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Label } from "@/extensions/document/types";
import type { PropType } from "vue";

export default defineComponent({
  name: "LabelComponent",

  props: {
    label: {
      type: Object as PropType<Label>,
      default() {
        return {
          message: "global.missing-label",
        };
      },
    },
  },

  computed: {
    compiledLabel() {
      if (!!this.label.data) {
        return this.$t(this.label.message, this.label.data);
      } else {
        return this.$t(this.label.message);
      }
    },
  },
});
</script>
