<template>
  <div class="flex flex-row items-center justify-between">
    <div class="flex flex-row gap-2 items-center">
      <!-- Title -->
      <span class="text-sm">
        <!-- eslint-disable vue/no-v-html -->
        <span class="pl-2 pr-3" v-html="calculateHexIcon(scaffold.id)" />
        <slot name="title">{{ scaffold.type }}</slot>
      </span>
    </div>

    <div class="flex grow flex-row items-center justify-end">
      <!-- Configuration -->
      <div class="flex grow gap-0.5 px-1 justify-end">
        <slot name="default"></slot>
      </div>

      <!-- Standard buttons -->
      <div class="flex gap-0.5 ml-3">
        <EditorMenuButton :on-inactive-click="() => editor.commands.addScaffold(scaffold)">
          <IconCopy />
        </EditorMenuButton>
        <EditorMenuButton :on-inactive-click="() => editor.commands.removeScaffold(scaffold)">
          <IconTrash />
        </EditorMenuButton>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import IconCopy from "@/helpers/icons/IconCopy.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import type { Scaffold } from "@/types";
import { calculateHexIcon } from "@/helpers/util";

export default defineComponent({
  name: "ScaffoldConfigurationComponent",

  components: { IconTrash, IconCopy, EditorMenuButton },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    scaffold: {
      type: Object as PropType<Scaffold>,
      required: true,
    },
  },

  data() {
    return {
      stateStore: this.editor.storage.document.stateStore(),
    };
  },

  methods: {
    calculateHexIcon(str: string) {
      return calculateHexIcon(str);
    },
  },
});
</script>
