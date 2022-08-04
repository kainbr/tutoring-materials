<template>
  <div class="gap-0.5">
    <EditorMenuButton
      :disabled="!editor.can().undo()"
      :on-inactive-click="() => editor.chain().focus().undo().run()"
    >
      <IconUndo />
    </EditorMenuButton>
    <EditorMenuButton
      :disabled="!editor.can().redo()"
      :on-inactive-click="() => editor.chain().focus().redo().run()"
    >
      <IconRedo />
    </EditorMenuButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconRedo from "@/helpers/icons/IconRedo.vue";
import IconUndo from "@/helpers/icons/IconUndo.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";

export default defineComponent({
  name: "MenuSectionHistory",

  components: {
    IconRedo,
    IconUndo,
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
