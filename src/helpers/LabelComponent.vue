<template>
  <span>
    <span v-if="label.hexIcon" class="px-2" v-html="label.hexIcon" />
    {{ $t(label.message, label.data) }}
  </span>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { Label } from "@/extensions/feedback/types";
import type { PropType } from "vue";

export default defineComponent({
  name: "LabelComponent",

  props: {
    label: {
      type: Object as PropType<Label>,
      required: true,
    },
  },
});
</script>
