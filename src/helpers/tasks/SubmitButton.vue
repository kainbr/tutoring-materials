<template>
  <div class="container rounded-lg" :class="backgroundColor">
    <div
      v-if="['correct', 'incorrect', 'final-incorrect'].includes(state)"
      class="flex justify-between transition"
    >
      <div class="flex flex-col">
        <div class="flex flex-row items-center">
          <span class="text-base font-medium" :class="titleColor">{{ title }}</span>
        </div>
        <div class="mt-1">
          <span class="text-sm" :class="fontColor">{{ text }}</span>
        </div>
      </div>
    </div>

    <button
      v-if="['init', 'incorrect'].includes(state)"
      class="mt-3 inline-flex items-center px-3 py-2 w-full justify-center border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      type="button"
      :disabled="disabled"
      @click="$emit('submit')"
    >
      {{ textSubmitButton }}
    </button>
    {{ disabled }}
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "SubmitButton",

  props: {
    id: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      default: "",
    },
    text: {
      type: String,
      default: "",
    },
    textSubmitButton: {
      type: String,
      default: "Submit",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    state: {
      type: String,
      default: "init",
      validator(value: string) {
        return ["init", "correct", "incorrect", "final-incorrect"].includes(value);
      },
    },
  },
  emits: ["submit"],

  computed: {
    backgroundColor() {
      return {
        "p-3": this.state !== "init",
        "bg-green-50": this.state === "correct",
        "bg-yellow-50": this.state === "incorrect",
        "bg-red-50": this.state === "final-incorrect",
      };
    },
    titleColor() {
      return {
        "text-green-800": this.state === "correct",
        "text-yellow-800": this.state === "incorrect",
        "text-red-800": this.state === "final-incorrect",
      };
    },
    fontColor() {
      return {
        "text-green-700": this.state === "correct",
        "text-yellow-700": this.state === "incorrect",
        "text-red-800": this.state === "final-incorrect",
      };
    },
  },
});
</script>
