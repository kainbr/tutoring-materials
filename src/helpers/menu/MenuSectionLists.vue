<template>
  <div class="gap-0.5">
    <EditorMenuButton
      :active="editor.isActive('bulletList')"
      :on-active-click="() => editor.commands.toggleBulletList()"
      :on-inactive-click="() => editor.commands.toggleBulletList()"
    >
      <IconListUnordered />
    </EditorMenuButton>
    <EditorMenuButton
      :active="editor.isActive('orderedList')"
      :on-active-click="() => editor.commands.toggleOrderedList()"
      :on-inactive-click="() => editor.commands.toggleOrderedList()"
    >
      <IconListOrdered />
    </EditorMenuButton>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconListOrdered from "@/helpers/icons/IconListOrdered.vue";
import IconListUnordered from "@/helpers/icons/IconListUnordered.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";

export default defineComponent({
  name: "MenuSectionList",

  components: {
    IconListOrdered,
    IconListUnordered,
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
