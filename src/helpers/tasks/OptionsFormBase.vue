<template>
  <div class="grid grid-cols-2 gap-4 items-center">
    <div class="flex flex-row items-center">
      <div class="pr-1.5 w-7">
        <IconQuestion
          v-if="description !== ''"
          v-tippy="tippyConfig"
          class="w-5 h-5"
        ></IconQuestion>
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
import IconQuestion from "@/helpers/icons/IconQuestion.vue";

export default defineComponent({
  name: "OptionsFormBase",

  components: { IconQuestion },

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
