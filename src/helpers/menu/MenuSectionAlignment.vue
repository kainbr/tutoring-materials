<template>
  <div class="gap-0.5">
    <EditorMenuButton
      :active="editor.isActive({ textAlign: 'left' })"
      :on-active-click="() => editor.chain().focus().setTextAlign('left').run()"
      :on-inactive-click="() => editor.chain().focus().setTextAlign('left').run()"
    >
      <IconAlignLeft />
    </EditorMenuButton>
    <EditorMenuButton
      :active="editor.isActive({ textAlign: 'center' })"
      :on-active-click="() => editor.chain().focus().setTextAlign('center').run()"
      :on-inactive-click="() => editor.chain().focus().setTextAlign('center').run()"
    >
      <IconAlignCenter />
    </EditorMenuButton>
    <EditorMenuButton
      :active="editor.isActive({ textAlign: 'right' })"
      :on-active-click="() => editor.chain().focus().setTextAlign('right').run()"
      :on-inactive-click="() => editor.chain().focus().setTextAlign('right').run()"
    >
      <IconAlignRight />
    </EditorMenuButton>
    <EditorMenuButton
      :active="editor.isActive({ textAlign: 'justify' })"
      :on-active-click="() => editor.chain().focus().setTextAlign('justify').run()"
      :on-inactive-click="() => editor.chain().focus().setTextAlign('justify').run()"
    >
      <IconAlignJustify />
    </EditorMenuButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconAlignLeft from "@/helpers/icons/IconAlignLeft.vue";
import IconAlignCenter from "@/helpers/icons/IconAlignCenter.vue";
import IconAlignRight from "@/helpers/icons/IconAlignRight.vue";
import IconAlignJustify from "@/helpers/icons/IconAlignJustify.vue";

export default defineComponent({
  name: "MenuSectionAlignment",

  components: {
    IconAlignJustify,
    IconAlignRight,
    IconAlignCenter,
    IconAlignLeft,
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
