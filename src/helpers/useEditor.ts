import { Editor } from "@tiptap/vue-3";
import { Document as BaseDocument } from "@tiptap/extension-document";
import { Document } from "@/extensions/document";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { TextAlign } from "@tiptap/extension-text-align";
import { Indent } from "@/extensions/indent";
import { CustomImage } from "@/extensions/image";
import { Infobox } from "@/extensions/infobox";
import { FeedbackExtension } from "@/extensions/feedback";
import { FeedbackHint } from "@/extensions/feedback/hint";
import { FeedbackNotification } from "@/extensions/feedback/notification";
import { FeedbackMark } from "@/extensions/feedback/mark";
import { Task } from "@/extensions/task";
import { SingleChoiceTask } from "@/extensions/task/single-choice";
import { useI18n } from "vue-i18n";
import { onBeforeUnmount, watch } from "vue";

import type { JSONContent } from "@tiptap/vue-3";
import type { SetupContext } from "vue";

export default function (
  props: { isEditor: boolean; content: JSONContent },
  context: SetupContext<("update:content" | "update:state" | "event")[]>
) {
  const { t, locale } = useI18n();

  // Editor
  const editor: Editor = new Editor({
    editorProps: {
      attributes: {
        // Keep this class here to make the full area of the editor clickable
        class: "h-full",
      },
    },
    extensions: [
      // Basic setup
      BaseDocument.extend({
        content: "document",
      }),
      Document.configure({
        isEditor: props.isEditor,
      }),
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
      Color,
      Subscript,
      Superscript,
      TextStyle,
      Typography,
      Underline,
      Placeholder.configure({
        includeChildren: true,
        placeholder: () => t("editor.placeholder-text"),
      }),
      TextAlign.configure({
        types: ["heading", "paragraph", "image"],
      }),

      // Custom Extensions
      Indent,
      CustomImage,
      Infobox,
      FeedbackExtension,
      FeedbackHint,
      FeedbackNotification,
      FeedbackMark.configure({ showOutline: props.isEditor }),
      Task,
      SingleChoiceTask,
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
