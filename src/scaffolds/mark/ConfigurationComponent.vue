<template>
  <scaffold-configuration-component :editor="editor" :scaffold="scaffold">
    <template #title>Text style</template>
    <template #default>
      <!-- Bold -->
      <MenuButton
        :active="!!scaffold.config.bold"
        :on-active-click="() => editor.commands.updateScaffold(scaffold, { bold: undefined })"
        :on-inactive-click="() => editor.commands.updateScaffold(scaffold, { bold: {} })"
      >
        <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M8 11h4.5a2.5 2.5 0 1 0 0-5H8v5zm10 4.5a4.5 4.5 0 0 1-4.5 4.5H6V4h6.5a4.5 4.5 0 0 1 3.256 7.606A4.498 4.498 0 0 1 18 15.5zM8 13v5h5.5a2.5 2.5 0 1 0 0-5H8z"
          />
        </svg>
      </MenuButton>

      <!-- Italic -->
      <MenuButton
        :active="!!scaffold.config.italic"
        :on-active-click="() => editor.commands.updateScaffold(scaffold, { italic: undefined })"
        :on-inactive-click="() => editor.commands.updateScaffold(scaffold, { italic: {} })"
        ><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M15 20H7v-2h2.927l2.116-12H9V4h8v2h-2.927l-2.116 12H15z" />
        </svg>
      </MenuButton>

      <!-- Underline -->
      <MenuButton
        :active="!!scaffold.config.underline"
        :on-active-click="() => editor.commands.updateScaffold(scaffold, { underline: undefined })"
        :on-inactive-click="() => editor.commands.updateScaffold(scaffold, { underline: {} })"
        ><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path d="M8 3v9a4 4 0 1 0 8 0V3h2v9a6 6 0 1 1-12 0V3h2zM4 20h16v2H4v-2z" />
        </svg>
      </MenuButton>

      <!-- Highlight -->
      <MenuButton
        :active="!!scaffold.config.highlight"
        :on-active-click="() => editor.commands.updateScaffold(scaffold, { highlight: undefined })"
        :on-inactive-click="() => editor.commands.updateScaffold(scaffold, { highlight: {} })"
        ><svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 0h24v24H0z" fill="none" />
          <path
            d="M15.243 4.515l-6.738 6.737-.707 2.121-1.04 1.041 2.828 2.829 1.04-1.041 2.122-.707 6.737-6.738-4.242-4.242zm6.364 3.535a1 1 0 0 1 0 1.414l-7.779 7.779-2.12.707-1.415 1.414a1 1 0 0 1-1.414 0l-4.243-4.243a1 1 0 0 1 0-1.414l1.414-1.414.707-2.121 7.779-7.779a1 1 0 0 1 1.414 0l5.657 5.657zm-6.364-.707l1.414 1.414-4.95 4.95-1.414-1.414 4.95-4.95zM4.283 16.89l2.828 2.829-1.414 1.414-4.243-1.414 2.828-2.829z"
          />
        </svg>
      </MenuButton>
    </template>
  </scaffold-configuration-component>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import type { PropType } from "vue";
import ScaffoldConfigurationComponent from "@/scaffolds/ConfigurationComponent.vue";
import MenuButton from "@/helpers/EditorMenuButton.vue";
import type { Editor } from "@tiptap/vue-3";
import type { MarkScaffold } from "@/types";

export default defineComponent({
  name: "ScaffoldMarkConfigurationComponent",

  components: { MenuButton, ScaffoldConfigurationComponent },

  props: {
    scaffold: {
      type: Object as PropType<MarkScaffold>,
      required: true,
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
  },

  data() {
    return {
      stateStore: this.editor.storage.document.stateStore(),
    };
  },

  methods: {
    convertKebabToPascalCase: (s: string) => {
      return s.replace(/(^\w|-\w)/g, (text) => {
        return text.replace(/-/, "").toUpperCase();
      });
    },
  },
});
</script>
