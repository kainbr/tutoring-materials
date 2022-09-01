import { Editor } from "@tiptap/vue-3";
import { onBeforeUnmount, watch } from "vue";
import { useI18n } from "vue-i18n";
import StarterKit from "@tiptap/starter-kit";

// Standard extensions
import { Color } from "@tiptap/extension-color";
import { Document as BaseDocument } from "@tiptap/extension-document";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";

// Custom extensions
import { CustomImage } from "@/extensions/image";
import { Document } from "@/extensions/document";
import { FeedbackExtension } from "@/extensions/feedback";
import { FeedbackHint } from "@/extensions/feedback/hint";
import { FeedbackMark } from "@/extensions/feedback/mark";
import { FeedbackNotification } from "@/extensions/feedback/notification";
import { Indent } from "@/extensions/indent";
import { Infobox } from "@/extensions/infobox";
import { SingleChoiceTask } from "@/extensions/task/single-choice";
import { Task } from "@/extensions/task";

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
      BaseDocument.extend({
        content: "document",
      }),
      Document.configure({
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

      // Custom Extensions
      CustomImage,
      FeedbackExtension,
      FeedbackHint,
      FeedbackMark.configure({ showOutline: props.isEditor }),
      FeedbackNotification,
      Indent,
      Infobox,
      SingleChoiceTask,
      Task,
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
