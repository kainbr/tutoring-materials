<template>
  <div class="flex flex-col w-full w-full">
    <div v-if="!isEditableReactive" class="my-1 w-full">
      <slot name="render" />
    </div>

    <div v-if="isEditableReactive" class="my-1 w-full">
      <slot name="content" />
    </div>

    <div v-if="isEditableReactive" class="my-1 w-full">
      <details>
        <summary class="cursor-pointer">{{ $t("editor.task.title-evaluation") }}</summary>
        <slot name="evaluation" />
      </details>
    </div>

    <div v-if="isEditableReactive" class="my-1 w-full">
      <details>
        <summary class="cursor-pointer">{{ $t("editor.task.title-options") }}</summary>
        <slot name="options" />
      </details>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";
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
    return { isEditableReactive };
  }
});
</script>
