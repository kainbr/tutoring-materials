<template>
  <OptionsFormBase :name="name" :label="label" :description="description">
    <template #default>
      <input
        :id="name"
        type="number"
        :min="min"
        :max="max"
        :name="name"
        :value="value"
        :disabled="disabled"
        class="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block py-1 px-2"
        @change="emitUpdate"
      />
    </template>
  </OptionsFormBase>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import OptionsFormBase from "./OptionsFormBase.vue";

export default defineComponent({
  name: "OptionsFormNumber",

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
    min: {
      type: Number,
      default: null,
    },
    max: {
      type: Number,
      default: null,
    },
    isInteger: {
      type: Boolean,
      default: true,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    value: {
      type: Number,
      required: true,
    },
  },

  emits: ["update:value"],

  methods: {
    emitUpdate($event: Event) {
      let value;

      if (!!$event?.target && "value" in $event.target) {
        value = this.isInteger
          ? parseInt(($event.target as HTMLInputElement).value)
          : parseFloat(($event.target as HTMLInputElement).value);
      } else {
        value = 0;
      }

      if (!!this.min && value < this.min) {
        value = this.min;
      }

      if (!!this.max && value > this.max) {
        value = this.max;
      }

      this.$emit("update:value", value);
    },
  },
});
</script>
