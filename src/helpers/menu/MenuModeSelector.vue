<template>
  <button type="button" @click="$emit('update:is-preview', !isPreview)"
          :class="{ 'bg-blue-600': isPreview, 'bg-gray-200': !isPreview }"
          class="relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:ring-offset-2"
          role="switch" aria-checked="false">
    <span class="sr-only">Use setting</span>
    <span
      :class="{ 'translate-x-5': isPreview, 'translate-x-0': !isPreview }"
      class="pointer-events-none relative inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out">
      <span
        :class="{ 'opacity-0 duration-100 ease-out': isPreview, 'opacity-100 duration-200 ease-in': !isPreview }"
        class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
        aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="h-3 w-3 text-gray-400">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125" />
        </svg>
      </span>
      <span
        :class="{ 'opacity-100 duration-200 ease-in': isPreview, 'opacity-0 duration-100 ease-out': !isPreview }"
        class="absolute inset-0 flex h-full w-full items-center justify-center transition-opacity"
        aria-hidden="true">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
             stroke="currentColor" class="h-3 w-3 text-blue-600">
          <path stroke-linecap="round" stroke-linejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
        </svg>
      </span>
    </span>
  </button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "EditorModeSelector",

  props: {
    isPreview: {
      type: Boolean,
      required: true
    }
  }
});
</script>
