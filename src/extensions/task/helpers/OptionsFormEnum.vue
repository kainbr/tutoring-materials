<template>
  <OptionsFormBase :name="name" :label="label" :description="description">
    <template #default>
      <select
        :id="name"
        :name="name"
        :value="value"
        :disabled="disabled"
        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-1 px-2"
        @change="$emit('update:value', $event)"
      >
        <option v-for="option in options" :key="option.value" :value="option.value">
          <LabelComponent :label="option.label" />
        </option>
      </select>
    </template>
  </OptionsFormBase>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OptionsFormBase from "./OptionsFormBase.vue";
import type { PropType } from "vue";
import type { Label } from "@/extensions/document/types";
import LabelComponent from "@/helpers/LabelComponent.vue";

export default defineComponent({
  name: "OptionsFormEnum",

  components: { LabelComponent, OptionsFormBase },

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
      type: Array as PropType<{ value: string; label: Label }[]>,
      required: true,
    },
  },

  emits: ["update:value"],
});
</script>
