<template>
  <OptionsFormBase :name="name" :label="label" :description="description">
    <template #default>
      <select
        :id="name"
        :name="name"
        :value="value"
        :disabled="disabled"
        class="w-full px-1.5 py-0.5 block focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
        @change="$emit('update:value', $event)"
      >
        <option v-for="option in options" :key="option">
          {{ option }}
        </option>
      </select>
    </template>
  </OptionsFormBase>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OptionsFormBase from "./OptionsFormBase.vue";
import type { PropType } from "vue";

export default defineComponent({
  name: "OptionsFormEnum",

  components: { OptionsFormBase },

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
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: String,
      required: true,
    },
    options: {
      type: Array as PropType<string[]>,
      required: true,
    },
  },

  emits: {
    "update:value": null,
  },
});
</script>
