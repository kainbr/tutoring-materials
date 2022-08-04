<template>
  <div class="gap-0.5">
    <EditorMenuButton
      :active="editor.isActive('paragraph')"
      :on-active-click="() => editor.chain().focus().setParagraph().run()"
      :on-inactive-click="() => editor.chain().focus().setParagraph().run()"
    >
      <IconParagraph />
    </EditorMenuButton>

    <EditorMenuButton
      :active="editor.isActive('heading', { level: 1 })"
      :on-active-click="() => editor.chain().focus().toggleHeading({ level: 1 }).run()"
      :on-inactive-click="() => editor.chain().focus().toggleHeading({ level: 1 }).run()"
    >
      <IconHeadingLevel1 />
    </EditorMenuButton>

    <EditorMenuButton
      :active="editor.isActive('heading', { level: 2 })"
      :on-active-click="() => editor.chain().focus().toggleHeading({ level: 2 }).run()"
      :on-inactive-click="() => editor.chain().focus().toggleHeading({ level: 2 }).run()"
    >
      <IconHeadingLevel2 />
    </EditorMenuButton>

    <EditorMenuButton
      :active="editor.isActive('heading', { level: 3 })"
      :on-active-click="() => editor.chain().focus().toggleHeading({ level: 3 }).run()"
      :on-inactive-click="() => editor.chain().focus().toggleHeading({ level: 3 }).run()"
    >
      <IconHeadingLevel3 />
    </EditorMenuButton>

    <EditorMenuButton
      :active="editor.isActive('blockquote')"
      :on-active-click="() => editor.chain().focus().toggleBlockquote().run()"
      :on-inactive-click="() => editor.chain().focus().toggleBlockquote().run()"
    >
      <IconBlockquote />
    </EditorMenuButton>

    <EditorMenuButton
      :active="editor.isActive('codeBlock')"
      :on-active-click="() => editor.chain().focus().toggleCodeBlock().run()"
      :on-inactive-click="() => editor.chain().focus().toggleCodeBlock().run()"
    >
      <IconCodeBlock />
    </EditorMenuButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconBlockquote from "@/helpers/icons/IconBlockquote.vue";
import IconCodeBlock from "@/helpers/icons/IconCodeBlock.vue";
import IconHeadingLevel1 from "@/helpers/icons/IconHeadingLevel1.vue";
import IconHeadingLevel2 from "@/helpers/icons/IconHeadingLevel2.vue";
import IconHeadingLevel3 from "@/helpers/icons/IconHeadingLevel3.vue";
import IconParagraph from "@/helpers/icons/IconParagraph.vue";

export default defineComponent({
  name: "MenuSectionParagraphs",

  components: {
    IconBlockquote,
    IconCodeBlock,
    IconHeadingLevel3,
    IconHeadingLevel2,
    IconHeadingLevel1,
    IconParagraph,
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
