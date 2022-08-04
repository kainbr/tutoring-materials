<template>
  <div class="gap-0.5">
    <EditorMenuButton :on-inactive-click="() => editor.chain().focus().decreaseIndent().run()">
      <IconIndentDecrease />
    </EditorMenuButton>
    <EditorMenuButton :on-inactive-click="() => editor.chain().focus().increaseIndent().run()">
      <IconIndentIncrease />
    </EditorMenuButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconIndentDecrease from "@/helpers/icons/IconIndentDecrease.vue";
import IconIndentIncrease from "@/helpers/icons/IconIndentIncrease.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";

export default defineComponent({
  name: "MenuSectionIndent",

  components: {
    IconIndentDecrease,
    IconIndentIncrease,
    EditorMenuButton,
  },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },
});
</script>
