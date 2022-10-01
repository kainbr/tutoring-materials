<template>
  <div :class="{ 'w-full': true, 'border rounded-lg': isEditor }">
    <!-- Menu -->
    <div
      v-if="isEditor"
      class="flex p-1 border rounded-t-lg justify-between items-center bg-slate-50"
    >
      <MenuSectionTypography :editor="editor" />
      <div class="flex flex-row gap-2">
        <EditorMenuButton @click="editor.chain().focus().insertGap().run()">
          <IconSpace />
        </EditorMenuButton>
      </div>
    </div>

    <!-- Content -->
    <div class="bg-white">
      <EditorContent
        :editor="editor"
        :content="content"
        class="w-full h-full mx-auto z-0 prose [&_p]:m-0 [&_h2]:mt-0 [&_h3]:mt-0 [&_blockquote]:mt-0 [&_pre]:mt-0 [&_ul]:mt-0 [&_ol]:mt-0 [&_li]:mt-0"
        :class="{
          'p-2': isEditor,
          'prose-sm': width < 500,
          'prose-base': width >= 500 && width < 900,
          'prose-lg': width >= 900,
        }"
      >
      </EditorContent>
    </div>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, inject, onBeforeUnmount, provide, watch } from "vue";
import { Editor, EditorContent } from "@tiptap/vue-3";

import { useI18n } from "vue-i18n";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import MenuSectionTypography from "@/helpers/menu/MenuSectionTypography.vue";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconSpace from "@/helpers/icons/IconSpace.vue";
import { Gap } from "@/extensions/task/fill-the-blank/gap";

import type { JSONContent } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { FTBEvaluation, FTBState } from "@/extensions/task/fill-the-blank/types";
import type { InjectedContainerDimensions } from "@/helpers/useContainerDimensions";

export default defineComponent({
  components: {
    IconSpace,
    EditorMenuButton,
    EditorContent,
    MenuSectionTypography,
  },

  props: {
    content: {
      type: Object as PropType<JSONContent>,
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

    evaluation: {
      type: Object as PropType<FTBEvaluation>,
      default() {
        return {};
      },
    },

    state: {
      type: Object as PropType<FTBState>,
      default() {
        return {};
      },
    },

    isEditor: {
      type: Boolean,
      default: false,
    },
  },

  emits: ["update:content", "update:evaluation", "update:state"],

  setup(props, context) {
    function updateEvaluation(attributes: Partial<FTBEvaluation>) {
      context.emit("update:evaluation", { ...props.evaluation, ...attributes });
    }

    provide("evaluation", {
      evaluation: computed(() => {
        return props.evaluation;
      }),
      updateEvaluation,
    });

    function updateState(attributes: Partial<FTBState>) {
      context.emit("update:state", { ...props.state, ...attributes });
    }

    provide("state", {
      state: computed(() => {
        return props.state;
      }),
      updateState,
    });

    const { width } = inject("containerDimensions") as InjectedContainerDimensions;

    const { t, locale } = useI18n();

    const editor: Editor = new Editor({
      editorProps: {
        attributes: {
          // Keep this class here to make the full area of the editor clickable
          class: "h-full",
        },
      },
      extensions: [
        StarterKit.configure({
          heading: {
            levels: [1, 2, 3],
          },
        }),
        Color,
        Placeholder.configure({
          includeChildren: true,
          placeholder: () => t("editor.placeholder-text"),
        }),
        Subscript,
        Superscript,
        TextAlign.configure({
          types: ["heading", "paragraph", "image"],
        }),
        TextStyle,
        Typography,
        Underline,
        Gap,
      ],
      content: props.content,
      autofocus: false,
      editable: props.isEditor,
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
      (content) => {
        const isSame = JSON.stringify(editor.getJSON()) === JSON.stringify(content);
        if (isSame) return;
        editor.commands.setContent(content, false);
      }
    );

    onBeforeUnmount(() => {
      editor.destroy();
    });

    return {
      editor,
      width,
    };
  },
});
</script>
