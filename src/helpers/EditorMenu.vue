<template>
  <div class="relative">
    <div class="p-2 bg-gray-50">
      <div class="flex flex-row flex-nowrap w-full justify-between">
        <div v-if="!isPreview" class="flex flex-row divide-x-2">
          <MenuSectionTypography :editor="editor" class="pr-2 flex flex-nowrap" />

          <MenuSectionAlignment :editor="editor" class="px-2 flex flex-nowrap" />

          <MenuSectionIndent :editor="editor" class="px-2 flex flex-nowrap" />

          <MenuSectionList :editor="editor" class="px-2 flex flex-nowrap" />
        </div>

        <div v-else class="flex flex-row">
          <MenuSectionPreview @reset:state="$emit('reset:state')"></MenuSectionPreview>
        </div>

        <div class="flex flex-row divide-x-2 mt-1.5 mr-6">
          <MenuModeSelector :is-preview="isPreview"
                            @update:is-preview="$emit('update:is-preview', $event)">
          </MenuModeSelector>
        </div>
      </div>

      <div v-if="!isPreview" class="flex flex-row flex-nowrap w-full justify-between mt-1">
        <div class="flex flex-row divide-x-2">
          <MenuSectionParagraphs :editor="editor" class="pr-3 flex flex-nowrap" />

          <MenuSectionCustom :editor="editor" class="pl-2 pr-2 flex flex-nowrap" />

          <MenuSectionFile :editor="editor" class="pl-2 pr-2 flex flex-nowrap" />
        </div>

        <!-- More -->
        <div class="flex flex-row divide-x-2">
          <MenuSectionHistory :editor="editor" class="pl-2 pr-3 flex flex-nowrap" />
        </div>
      </div>
    </div>

    <!-- Image Sub Menu -->
    <div id="menu-sub" class="absolute bg-gray-50 flex justify-between w-full z-10 border-b" />
  </div>
</template>

<!--suppress JSUnresolvedVariable -->
<script lang="ts">
import { defineComponent } from "vue";
import IconRotateLeft from "@/helpers/icons/IconRotateLeft.vue";
import IconMessage from "@/helpers/icons/IconMessage.vue";
import IconRefresh from "@/helpers/icons/IconRefresh.vue";
import MenuModeSelector from "@/helpers/menu/MenuModeSelector.vue";
import MenuSectionAlignment from "@/helpers/menu/MenuSectionAlignment.vue";
import MenuSectionCustom from "@/helpers/menu/MenuSectionCustom.vue";
import MenuSectionFile from "@/helpers/menu/MenuSectionFile.vue";
import MenuSectionHistory from "@/helpers/menu/MenuSectionHistory.vue";
import MenuSectionIndent from "@/helpers/menu/MenuSectionIntend.vue";
import MenuSectionList from "@/helpers/menu/MenuSectionLists.vue";
import MenuSectionParagraphs from "@/helpers/menu/MenuSectionParagraphs.vue";
import MenuSectionPreview from "@/helpers/menu/MenuSectionPreview.vue";
import MenuSectionTypography from "@/helpers/menu/MenuSectionTypography.vue";
import type { Editor } from "@tiptap/vue-3";
import type { PropType } from "vue";

export default defineComponent({
  name: "EditorMenu",

  emits: ["reset:state", "update:is-preview"],

  components: {
    IconRefresh,
    IconMessage,
    IconRotateLeft,
    MenuModeSelector,
    MenuSectionAlignment,
    MenuSectionCustom,
    MenuSectionFile,
    MenuSectionHistory,
    MenuSectionIndent,
    MenuSectionList,
    MenuSectionParagraphs,
    MenuSectionPreview,
    MenuSectionTypography
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true
    },
    isPreview: {
      type: Boolean,
      default: false
    }
  }
});
</script>
