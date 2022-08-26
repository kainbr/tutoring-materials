<template>
  <div class="gap-0.5">
    <!--suppress JSUndeclaredVariable -->
    <EditorMenuButton :on-inactive-click="() => (fileModalOpen = true)">
      <IconUpload />
    </EditorMenuButton>
    <EditorMenuButton :on-inactive-click="() => editor.commands.saveDocument()">
      <IconSave />
    </EditorMenuButton>

    <!-- Upload Modal -->
    <UploadModal
      v-model="fileModalOpen"
      :editor="editor"
      :title="$t('editor.menu.file-upload-headline')"
      :upload-callback="(e: Event) => editor.commands.uploadDocument(e)"
      :supported-formats="$t('editor.menu.file-upload-supported-formats')"
      :accepted-files="'file/*,.json'"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconUpload from "@/helpers/icons/IconUpload.vue";
import IconSave from "@/helpers/icons/IconSave.vue";
import UploadModal from "@/helpers/menu/UploadModal.vue";

export default defineComponent({
  name: "MenuSectionFile",

  components: {
    UploadModal,
    EditorMenuButton,
    IconSave,
    IconUpload,
  },

  props: {
    editor: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      fileModalOpen: false,
    };
  },
});
</script>
