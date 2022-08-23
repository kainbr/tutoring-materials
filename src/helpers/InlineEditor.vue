<!--suppress JSCheckFunctionSignatures -->
<template>
  <!-- Bubble Menu -->
  <!--suppress JSValidateTypes -->
  <BubbleMenu
    v-if="editor"
    :editor="editor"
    :tippy-options="{ duration: 100 }"
    class="border bg-white rounded-xl"
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
  </BubbleMenu>

  <!-- Editor Content -->
  <editor-content :editor="editor" class="[&_p]:my-0 [&_p]:py-0" />
</template>

<script lang="ts">
import { defineComponent, onBeforeUnmount, watch } from "vue";
import type { PropType } from "vue";
import { BubbleMenu, Editor, EditorContent } from "@tiptap/vue-3";
import StarterKit from "@tiptap/starter-kit";
import { Placeholder } from "@tiptap/extension-placeholder";
import IconBold from "@/helpers/icons/IconBold.vue";
import IconItalic from "@/helpers/icons/IconItalic.vue";
import IconUnderline from "@/helpers/icons/IconUnderline.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import type { JSONContent } from "@tiptap/vue-3";
import { useI18n } from "vue-i18n";

interface Props {
  readonly content: object | undefined;
  readonly isEditor: boolean;
  readonly showBubbleMenu: boolean;
  readonly showTopMenu: boolean;
}

export default defineComponent({
  name: "InlineEditor",

  components: {
    EditorContent,
    BubbleMenu,
    IconBold,
    IconItalic,
    IconUnderline,
    EditorMenuButton,
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

  setup(props: Props, context) {
    const { t, locale } = useI18n();

    const editor: Editor = new Editor({
      extensions: [
        StarterKit,
        Placeholder.configure({
          placeholder: () => t("editor.placeholder-text"),
        }),
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
