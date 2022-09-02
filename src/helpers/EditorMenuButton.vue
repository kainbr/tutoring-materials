<template>
  <button
    :class="{
      'bg-black fill-white': active,
    }"
    class="enabled:hover:bg-black enabled:hover:fill-white focus:outline-none font-medium rounded-lg text-sm p-1 text-center inline-flex items-center disabled:opacity-10"
    type="button"
    :disabled="disabled"
    @click="active ? onActiveClick() : onInactiveClick()"
  >
    <slot></slot>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "EditorMenuButton",

  props: {
    active: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    onActiveClick: {
      type: Function,
      default: () => {
        return;
      },
    },
    onInactiveClick: {
      type: Function,
      default: () => {
        return;
      },
    },
  },
});
</script>
