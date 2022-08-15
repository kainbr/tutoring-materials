<template>
  <div class="gap-0.5">
    <EditorMenuButton :on-inactive-click="() => editor.commands.setHorizontalRule()">
      <IconSeparator />
    </EditorMenuButton>
    <!--suppress JSUndeclaredVariable -->
    <EditorMenuButton :on-inactive-click="() => (imageModalOpen = true)">
      <IconImage />
    </EditorMenuButton>
    <EditorMenuButton :on-inactive-click="() => editor.commands.setInfobox()">
      <IconFolderInfo />
    </EditorMenuButton>
    <EditorMenuButton :on-inactive-click="() => editor.commands.setSingleChoiceTask()">
      <IconTask />
    </EditorMenuButton>

    <UploadModal
      v-model="imageModalOpen"
      :editor="editor"
      :upload-callback="(e) => editor.commands.uploadImage(e)"
      accepted-files="image/png, image/jpeg"
      :title="$t('editor.menu.image-upload-headline')"
      :supported-formats="$t('editor.menu.image-upload-supported-formats')"
      :supplementary-text="$t('editor.menu.image-upload-supplementary-text')"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconFolderInfo from "@/helpers/icons/IconFolderInfo.vue";
import IconImage from "@/helpers/icons/IconImage.vue";
import IconSeparator from "@/helpers/icons/IconSeparator.vue";
import IconTask from "@/helpers/icons/IconTask.vue";
import UploadModal from "@/helpers/menu/UploadModal.vue";

export default defineComponent({
  name: "MenuSectionCustom",

  components: {
    IconFolderInfo,
    IconImage,
    IconSeparator,
    IconTask,
    UploadModal,
    EditorMenuButton,
  },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      imageModalOpen: false,
    };
  },
});
</script>
