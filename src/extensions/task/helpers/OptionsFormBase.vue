<template>
  <div class="grid grid-cols-2 gap-4 items-center">
    <div class="flex flex-row items-center">
      <div class="pr-1.5 w-7">
        <IconQuestionMark v-if="description !== ''" v-tippy="tippyConfig" class="w-5 h-5" />
      </div>
      <label :for="name" class="block text-sm font-medium text-gray-700">{{ label }}</label>
    </div>
    <div class="col-span-1">
      <div class="max-w-lg flex rounded-md">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconQuestionMark from "@/helpers/icons/IconQuestionMark.vue";

export default defineComponent({
  name: "OptionsFormBase",

  components: { IconQuestionMark },

  props: {
    name: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },

  computed: {
    tippyConfig() {
      return { content: this.description, theme: "light-border", arrow: false, placement: "right" };
    },
  },
});
</script>
