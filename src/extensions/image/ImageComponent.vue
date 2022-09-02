<template>
  <node-view-wrapper>
    <!-- Rendered view -->
    <div
      :class="[node.attrs.float !== 'none' ? undefined : 'flex justify-' + alignment]"
      class="mb-4"
    >
      <figure
        :class="[
          node.attrs.float === 'left' ? 'mr-4' : '',
          node.attrs.float === 'right' ? 'ml-4' : '',
          editor.isEditable ? 'border-4 ' + (selected ? 'border-amber-400' : 'border-white') : '',
        ]"
        :draggable="editor.isEditable"
        :style="
          'width: ' +
          (node.attrs.size === 'full' ? '100%' : node.attrs.size + 'px') +
          '; ' +
          'float: ' +
          node.attrs.float
        "
        class="flex flex-col my-0 max-w-full"
        contenteditable="false"
        data-drag-handle
      >
        <img ref="figureBox" :alt="node.attrs.alt" :src="node.attrs.src" class="max-w-full" />
        <figcaption v-if="node.attrs.title" class="text-xs">
          {{ node.attrs.title }}
        </figcaption>
      </figure>
    </div>

    <!-- Teleport the config to the editor sub menu -->
    <Teleport v-if="editor?.isEditable && selected" to="#menu-sub">
      <div class="flex flex-row w-full gap-6 py-1 px-2 items-center">
        <div>
          <div class="flex flex-row">
            <span class="text-sm font-medium p-1">
              {{ $t("editor.menu.image-size-description") }}:
            </span>
            <button
              :class="{
                underline: editor.isActive('image', { size: '120' }),
              }"
              class="text-sm hover:opacity-100 font-medium opacity-60 p-1"
              @click="editor.chain().focus().updateAttributes('image', { size: '120' }).run()"
            >
              xs
            </button>
            <button
              :class="{
                underline: editor.isActive('image', { size: '160' }),
              }"
              class="text-sm hover:opacity-100 font-medium opacity-60 p-1"
              @click="editor.chain().focus().updateAttributes('image', { size: '160' }).run()"
            >
              sm
            </button>
            <button
              :class="{
                underline: editor.isActive('image', { size: '240' }),
              }"
              class="text-sm hover:opacity-100 font-medium opacity-60 p-1"
              @click="editor.chain().focus().updateAttributes('image', { size: '240' }).run()"
            >
              md
            </button>
            <button
              :class="{
                underline: editor.isActive('image', { size: '320' }),
              }"
              class="text-sm hover:opacity-100 font-medium opacity-60 p-1"
              @click="editor.chain().focus().updateAttributes('image', { size: '320' }).run()"
            >
              lg
            </button>
            <button
              :class="{
                underline: editor.isActive('image', { size: '480' }),
              }"
              class="text-sm hover:opacity-100 font-medium opacity-60 p-1"
              @click="editor.chain().focus().updateAttributes('image', { size: '480' }).run()"
            >
              xl
            </button>
            <button
              :class="{ underline: editor.isActive('image', { size: 'full' }) }"
              class="text-sm hover:opacity-100 font-medium opacity-60 p-1"
              @click="editor.chain().focus().updateAttributes('image', { size: 'full' }).run()"
            >
              full
            </button>
          </div>
          <div class="flex flex-row mt-1">
            <span class="text-sm font-medium p-1">
              {{ $t("editor.menu.image-floating-description") }}:
            </span>
            <button
              :class="{
                underline: editor.isActive('image', { float: 'left' }),
              }"
              class="text-sm hover:opacity-100 font-medium opacity-60 p-1"
              @click="editor.chain().focus().updateAttributes('image', { float: 'left' }).run()"
            >
              {{ $t("editor.menu.image-floating-left") }}
            </button>
            <button
              :class="{
                underline: editor.isActive('image', { float: 'none' }),
              }"
              class="text-sm hover:opacity-100 font-medium opacity-60 p-1"
              @click="editor.chain().focus().updateAttributes('image', { float: 'none' }).run()"
            >
              {{ $t("editor.menu.image-floating-disabled") }}
            </button>
            <button
              :class="{
                underline: editor.isActive('image', { float: 'right' }),
              }"
              class="text-sm hover:opacity-100 font-medium opacity-60 p-1"
              @click="editor.chain().focus().updateAttributes('image', { float: 'right' }).run()"
            >
              {{ $t("editor.menu.image-floating-right") }}
            </button>
          </div>
        </div>
        <div class="flex flex-col grow">
          <div class="flex flex-row">
            <span class="text-sm font-medium p-1 pr-2 w-32">
              {{ $t("editor.menu.image-caption-description") }}:
            </span>
            <input
              :value="node.attrs.title"
              class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-2 pr-2 grow"
              :placeholder="$t('editor.menu.image-caption-description')"
              type="text"
              @input="updateTitle"
            />
          </div>
          <div class="flex flex-row mt-1">
            <span class="text-sm font-medium p-1 pr-2 w-32"> Alt: </span>
            <input
              :value="node.attrs.alt"
              class="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md pl-2 pr-2 grow"
              :placeholder="$t('editor.menu.image-alt-description')"
              type="text"
              @input="updateAlt"
            />
          </div>
        </div>
      </div>
    </Teleport>
  </node-view-wrapper>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { NodeViewWrapper } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { NodeViewProps } from "@tiptap/core";

export default defineComponent({
  components: {
    NodeViewWrapper,
  },

  props: {
    editor: { type: Object as PropType<NodeViewProps["editor"]>, required: true },
    node: { type: Object as PropType<NodeViewProps["node"]>, required: true },
    decorations: { type: Object as PropType<NodeViewProps["decorations"]>, required: true },
    selected: { type: Boolean as PropType<NodeViewProps["selected"]>, required: true },
    extension: { type: Object as PropType<NodeViewProps["extension"]>, required: true },
    getPos: { type: Function as PropType<NodeViewProps["getPos"]>, required: true },
    updateAttributes: {
      type: Function as PropType<NodeViewProps["updateAttributes"]>,
      required: true,
    },
    deleteNode: { type: Function as PropType<NodeViewProps["deleteNode"]>, required: true },
  },

  computed: {
    alignment() {
      switch (this.node.attrs.textAlign) {
        case "center":
          return "center";
        case "right":
          return "end";
        default:
        case "left":
          return "start";
      }
    },
  },

  methods: {
    updateTitle($event: Event) {
      this.updateAttributes({ title: ($event.target as HTMLInputElement).value });
    },
    updateAlt($event: Event) {
      this.updateAttributes({ alt: ($event.target as HTMLInputElement).value });
    },
  },
});
</script>
