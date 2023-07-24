<template>
  <OptionsFormBase :name="name" :label="label" :description="description">
    <template #default>
      <input
        :id="name"
        type="text"
        :name="name"
        :value="value"
        :disabled="disabled"
        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-1 px-2"
        @input="updateValue"
      />
    </template>
  </OptionsFormBase>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OptionsFormBase from "./OptionsFormBase.vue";

export default defineComponent({
  name: "OptionsFormString",

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
  },

  emits: ["update:value"],

  methods: {
    updateValue($event: Event) {
      this.$emit("update:value", ($event.target as HTMLInputElement).value);
    },
  },
});
</script>
