<!--suppress JSCheckFunctionSignatures -->
<template>
  <!-- Bubble Menu -->
  <!--suppress JSValidateTypes -->
  <BubbleMenu
    v-if="editor && showBubbleMenu"
    :editor="editor"
    :tippy-options="{ duration: 100, theme: 'light-border' }"
    class="flex flex-row bg-white rounded-xl gap-0.5"
  >
    <EditorMenuButton
      :active="editor.isActive('bold')"
      :on-active-click="() => editor.chain().focus().toggleBold().run()"
      :on-inactive-click="() => editor.chain().focus().toggleBold().run()"
    >
      <IconBold />
    </EditorMenuButton>
    <EditorMenuButton
      :active="editor.isActive('italic')"
      :on-active-click="() => editor.chain().focus().toggleItalic().run()"
      :on-inactive-click="() => editor.chain().focus().toggleItalic().run()"
    >
      <IconItalic />
    </EditorMenuButton>
    <EditorMenuButton
      :active="editor.isActive('underline')"
      :on-active-click="() => editor.chain().focus().toggleUnderline().run()"
      :on-inactive-click="() => editor.chain().focus().toggleUnderline().run()"
    >
      <IconUnderline />
    </EditorMenuButton>
    <span class="ml-0.5 relative z-10 inline-flex">
      <Menu as="span" class="-ml-px relative block">
        <MenuButton
          class="relative inline-flex items-center text-center hover:bg-black hover:fill-white focus:outline-none font-medium rounded-lg text-sm p-1 h-full"
        >
          <span class="sr-only">Open options</span>
          <IconFontColor
            :fill="
              editor.getAttributes('textStyle').color ? editor.getAttributes('textStyle').color : ''
            "
          />
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
            class="origin-top-right absolute z-0 right-0 -mr-1 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none translate-x-1/2"
          >
            <div class="flex flex-row p-2">
              <MenuItem>
                <div
                  class="bg-white border border-red-500 relative p-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().unsetColor().run()"
                >
                  <span aria-hidden="true" class="bg-white h-2 w-2 rounded-full" />
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  class="bg-black relative p-1.5 ml-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().setColor('#000000').run()"
                >
                  <span
                    aria-hidden="true"
                    class="bg-black h-2 w-2 border-opacity-10 rounded-full"
                  />
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  class="bg-red-500 relative p-1.5 ml-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().setColor('#EF4444').run()"
                >
                  <span
                    aria-hidden="true"
                    class="bg-red-500 h-2 w-2 border-opacity-10 rounded-full"
                  />
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  class="bg-green-500 relative p-1.5 ml-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().setColor('#22C55E').run()"
                >
                  <span
                    aria-hidden="true"
                    class="bg-green-500 h-2 w-2 border-opacity-10 rounded-full"
                  />
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  class="bg-yellow-500 relative p-1.5 ml-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().setColor('#EAB308').run()"
                >
                  <span
                    aria-hidden="true"
                    class="bg-yellow-500 h-2 w-2 border-opacity-10 rounded-full"
                  />
                </div>
              </MenuItem>
              <MenuItem>
                <div
                  class="bg-blue-500 relative p-1.5 ml-1.5 rounded-full flex items-center justify-center cursor-pointer focus:outline-none"
                  @click="editor.chain().focus().setColor('#3B82F6').run()"
                >
                  <span
                    aria-hidden="true"
                    class="bg-blue-500 h-2 w-2 border-opacity-10 rounded-full"
                  />
                </div>
              </MenuItem>
            </div>
          </MenuItems>
        </transition>
      </Menu>
    </span>
    <EditorMenuButton @click="editor.chain().focus().unsetAllMarks().run()">
      <IconFormatClear />
    </EditorMenuButton>
  </BubbleMenu>

  <div v-if="showTopMenu" class="border border-b-0 p-2">
    <MenuSectionTypography :editor="editor" />
  </div>

  <!-- Editor Content -->
  <editor-content
    :editor="editor"
    class="[&_p]:my-0 [&_p]:py-0"
    :class="{ 'border p-4': showTopMenu }"
  />
</template>

<script lang="ts">
import { BubbleMenu, Editor, EditorContent } from "@tiptap/vue-3";
import { Color } from "@tiptap/extension-color";
import { defineComponent, onBeforeUnmount, watch } from "vue";
import { Math } from "@/extensions/math";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/vue";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { Underline } from "@tiptap/extension-underline";
import { TextStyle } from "@tiptap/extension-text-style";
import { useI18n } from "vue-i18n";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconBold from "@/helpers/icons/IconBold.vue";
import IconFontColor from "@/helpers/icons/IconFontColor.vue";
import IconFormatClear from "@/helpers/icons/IconFormatClear.vue";
import IconItalic from "@/helpers/icons/IconItalic.vue";
import IconUnderline from "@/helpers/icons/IconUnderline.vue";
import MenuSectionTypography from "@/helpers/menu/MenuSectionTypography.vue";
import StarterKit from "@tiptap/starter-kit";

import type { PropType } from "vue";
import type { JSONContent } from "@tiptap/vue-3";

export default defineComponent({
  name: "InlineEditor",

  components: {
    MenuSectionTypography,
    BubbleMenu,
    IconBold,
    IconFontColor,
    IconFormatClear,
    IconItalic,
    IconUnderline,
    EditorContent,
    EditorMenuButton,
    // eslint-disable-next-line vue/no-reserved-component-names
    Menu,
    MenuButton,
    MenuItem,
    MenuItems,
  },

  props: {
    content: {
      type: Object as PropType<JSONContent | undefined>,
      default() {
        return {
          type: "doc",
          content: [
            {
              type: "paragraph",
            },
          ],
        };
      },
    },
    isEditor: {
      type: Boolean,
      default: false,
    },
    showBubbleMenu: {
      type: Boolean,
      default: true,
    },
    showTopMenu: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:content"],

  setup(props, context) {
    const { t, locale } = useI18n();

    const editor: Editor = new Editor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: () => t("editor.placeholder-text"),
        }),
        Color,
        TextStyle,
        Subscript,
        Superscript,
        Underline,
        Math,
      ],
      editable: props.isEditor,
      content: props.content,
      autofocus: false,
      injectCSS: true,
      onCreate: () => {
        if (props.isEditor) {
          context.emit("update:content", editor.getJSON());
        }
      },
      onUpdate: () => {
        if (props.isEditor) {
          context.emit("update:content", editor.getJSON());
        }
      },
    });

    // Watch locale change to trigger an event view update
    // https://github.com/ueberdosis/tiptap/issues/1935
    watch(locale, () => {
      editor.view.dispatch(editor.state.tr);
    });

    watch(
      () => props.content,
      (content: JSONContent) => {
        if (JSON.stringify(editor.getJSON()) !== JSON.stringify(content)) {
          editor.commands.setContent(content, true);
        }
      },
      { deep: true }
    );

    onBeforeUnmount(() => {
      editor.destroy();
    });

    return { editor };
  },
});
</script>
