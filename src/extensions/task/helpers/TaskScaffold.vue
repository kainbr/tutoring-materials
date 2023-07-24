<template>
  <div class="flex flex-col w-full w-full">
    <div v-if="!isEditableReactive" class="my-1 w-full">
      <slot name="render" />
    </div>

    <div v-if="isEditableReactive" class="mb-1 w-full">
      <div class="relative">
        <div aria-hidden="true" class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-start cursor-pointer" @click="is_open_content = !is_open_content">
          <span class="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
            Inhalt
          <svg class="ml-1 w-4 h-4 inline-block" fill="none" stroke="currentColor" stroke-width="1.5"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path v-if="!is_open_content" d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round"
                  stroke-linejoin="round" />
            <path v-else d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          </span>
        </div>
      </div>
      <div v-show="is_open_content" class="pt-2">
        <slot name="content" />
      </div>
    </div>

    <div v-if="isEditableReactive" class="my-1 w-full">
      <div class="relative">
        <div aria-hidden="true" class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-start cursor-pointer" @click="is_open_evaluation = !is_open_evaluation">
          <span class="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
            {{ $t("editor.task.title-evaluation") }}
          <svg class="ml-1 w-4 h-4 inline-block" fill="none" stroke="currentColor" stroke-width="1.5"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path v-if="!is_open_evaluation" d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round"
                  stroke-linejoin="round" />
            <path v-else d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          </span>
        </div>
      </div>
      <div v-show="is_open_evaluation" class="pt-2">
        <slot name="evaluation" />
      </div>
    </div>

    <div v-if="isEditableReactive" class="my-1 w-full">
      <div class="relative">
        <div aria-hidden="true" class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-200"></div>
        </div>
        <div class="relative flex justify-start cursor-pointer" @click="is_open_options = !is_open_options">
          <span class="bg-white pr-3 text-base font-semibold leading-6 text-gray-900">
            {{ $t("editor.task.title-options") }}
          <svg class="ml-1 w-4 h-4 inline-block" fill="none" stroke="currentColor" stroke-width="1.5"
               viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path v-if="!is_open_options" d="M8.25 4.5l7.5 7.5-7.5 7.5" stroke-linecap="round"
                  stroke-linejoin="round" />
            <path v-else d="M19.5 8.25l-7.5 7.5-7.5-7.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          </span>
        </div>
      </div>
      <div v-show="is_open_options" class="pt-2">
        <slot name="options" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject, ref } from "vue";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";

export default defineComponent({
  name: "TaskScaffold",

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
    }
  },

  setup(props) {
    const isEditableReactive: Boolean = inject("isEditableReactive", props.editor.isEditable);

    const is_open_content = ref(true);
    const is_open_options = ref(false);
    const is_open_evaluation = ref(false);

    return { isEditableReactive, is_open_content, is_open_options, is_open_evaluation };
  }
});
</script>
