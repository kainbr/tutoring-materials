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

    <span class="ml-0.5 relative z-50 inline-flex">
      <Menu as="span" class="-ml-px relative block">
        <MenuButton
          class="relative hover:bg-black hover:fill-white focus:outline-none font-medium rounded-lg text-sm p-1 text-center inline-flex items-center"
        >
          <IconTask />
          <IconDropDown />
        </MenuButton>
        <transition
          enter-active-class="transition ease-out duration-100"
          enter-from-class="transform opacity-0 scale-95"
          enter-to-class="transform opacity-100 scale-100"
          leave-active-class="transition ease-in duration-75"
          leave-from-class="transform opacity-100 scale-100"
          leave-to-class="transform opacity-0 scale-95"
        >
          <MenuItems
            class="origin-top-right w-auto absolute right-0 -mr-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none"
          >
            <MenuItem>
              <button
                class="min-w-max hover:bg-black w-full hover:text-white focus:outline-none rounded-t-md font-medium text-sm p-1 text-center inline-flex items-center justify-end px-2"
                @click="editor.commands.setSingleChoiceTask()"
              >
                {{ $t("editor.task.type-single-choice") }}
              </button>
            </MenuItem>
            <MenuItem>
              <button
                class="min-w-max hover:bg-black w-full hover:text-white focus:outline-none font-medium text-sm p-1 text-center inline-flex items-center justify-end px-2"
                @click="editor.commands.setMultipleChoiceTask()"
              >
                {{ $t("editor.task.type-multiple-choice") }}
              </button>
            </MenuItem>
            <MenuItem>
              <button
                class="min-w-max hover:bg-black w-full hover:text-white focus:outline-none font-medium text-sm p-1 text-center inline-flex items-center justify-end px-2"
                @click="editor.commands.setTrueFalseTask()"
              >
                {{ $t("editor.task.type-true-false") }}
              </button>
            </MenuItem>
            <MenuItem>
              <button
                class="min-w-max hover:bg-black w-full hover:text-white focus:outline-none font-medium text-sm p-1 text-center inline-flex items-center justify-end px-2"
                @click="editor.commands.setFillTheBlankTask()"
              >
                {{ $t("editor.task.type-fill-the-blank") }}
              </button>
            </MenuItem>
            <MenuItem>
              <button
                class="min-w-max hover:bg-black w-full hover:text-white focus:outline-none font-medium text-sm p-1 text-center inline-flex items-center justify-end px-2"
                @click="editor.commands.setFindHotspotsTask()"
              >
                {{ $t("editor.task.type-find-hotspots") }}
              </button>
            </MenuItem>
            <MenuItem>
              <button
                class="min-w-max hover:bg-black w-full hover:text-white focus:outline-none rounded-b-md font-medium text-sm p-1 text-center inline-flex items-center justify-end px-2"
                @click="editor.commands.setMappingTask()"
              >
                {{ $t("editor.task.type-mapping") }}
              </button>
            </MenuItem>
          </MenuItems>
        </transition>
      </Menu>
    </span>

    <UploadModal
      v-model="imageModalOpen"
      :editor="editor"
      :upload-callback="(e: Event) => editor.commands.uploadImage(e)"
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
import IconDropDown from "@/helpers/icons/IconDropDown.vue";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import UploadModal from "@/helpers/menu/UploadModal.vue";

export default defineComponent({
  name: "MenuSectionCustom",

  components: {
    IconFolderInfo,
    IconImage,
    IconSeparator,
    IconTask,
    IconDropDown,
    EditorMenuButton,
    // eslint-disable-next-line vue/no-reserved-component-names
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
    UploadModal,
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
