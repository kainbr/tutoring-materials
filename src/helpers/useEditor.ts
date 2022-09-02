import { Editor } from "@tiptap/vue-3";
import { onBeforeUnmount, watch } from "vue";
import { useI18n } from "vue-i18n";
import StarterKit from "@tiptap/starter-kit";

// Standard extensions
import { Color } from "@tiptap/extension-color";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { TutoringMaterial } from "@/extensions/tutoringMaterial";
import { Underline } from "@tiptap/extension-underline";

import type { JSONContent } from "@tiptap/vue-3";
import type { SetupContext } from "vue";

export default function (
  props: { isEditor: boolean; content: JSONContent },
  context: SetupContext<("update:content" | "update:state" | "event")[]>
): { editor: Editor } {
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
        document: false,
        dropcursor: {
          color: "#ff0000",
          width: 2,
        },
        heading: {
          levels: [1, 2, 3],
        },
      }),
      TutoringMaterial.configure({
        isEditor: props.isEditor,
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

  onBeforeUnmount(() => {
    editor.destroy();
  });

  return { editor };
}
