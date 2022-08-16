<template>
  <div class="flex flex-col w-full w-full">
    <div v-if="!isEditor" class="my-1 w-full">
      <slot name="render" />
    </div>

    <div v-if="isEditor" class="my-1 w-full">
      <slot name="content" />
    </div>

    <div v-if="isEditor" class="my-1 w-full">
      <details>
        <summary>{{ $t("editor.task.title-evaluation") }}</summary>
        <slot name="evaluation" />
      </details>
    </div>

    <div v-if="isEditor" class="my-1 w-full">
      <details>
        <summary>{{ $t("editor.task.title-feedbacks") }}</summary>
        <slot name="feedbacks" />
      </details>
    </div>

    <div v-if="isEditor" class="my-1 w-full">
      <details>
        <summary>{{ $t("editor.task.title-options") }}</summary>
        <slot name="options" />
      </details>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "TaskScaffold",

  props: {
    isEditor: {
      type: Boolean,
      default: true,
    },
  },

  emits: ["submit"],
});
</script>
