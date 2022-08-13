<template>
  <OptionsFormBase :name="name" :label="label" :description="description">
    <template #default>
      <input
        :id="name"
        type="checkbox"
        :name="name"
        :disabled="disabled"
        :checked="value"
        class="block focus:ring-indigo-500 focus:border-indigo-500 min-w-0 rounded-none rounded-r-md sm:text-sm border-gray-300"
        @change="$emit('update:value', $event.target.checked)"
      />
    </template>
  </OptionsFormBase>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OptionsFormBase from "./OptionsFormBase.vue";

export default defineComponent({
  name: "ConfigurationFormBoolean",

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
      type: Boolean,
      required: true,
    },
  },

  emits: {
    "update:value": null,
  },
});
</script>
