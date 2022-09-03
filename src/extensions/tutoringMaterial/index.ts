import { CustomImage } from "@/extensions/image";
import { Document as BaseDocument } from "@tiptap/extension-document";
import { Document } from "@/extensions/document";
import { Extension } from "@tiptap/core";
import { FeedbackExtension } from "@/extensions/feedback";
import { FeedbackHint } from "@/extensions/feedback/hint";
import { FeedbackMark } from "@/extensions/feedback/mark";
import { FeedbackNotification } from "@/extensions/feedback/notification";
import { Indent } from "@/extensions/indent";
import { Infobox } from "@/extensions/infobox";
import { Math } from "@/extensions/math";
import { TaskExtension } from "@/extensions/task";
import { TaskSingleChoice } from "@/extensions/task/single-choice";

import type { IndentOptions } from "@/extensions/indent";
import { TaskMultipleChoice } from "@/extensions/task/multiple-choice";

export interface TutoringMaterialOptions {
  isEditor: boolean;
  image: false;
  indent: Partial<IndentOptions> | false;
  infobox: false;
  math: false;
  feedbackHint: false;
  feedbackMark: false;
  feedbackNotification: false;
  taskSingleChoice: false;
  taskMultipleChoice: false;
}

export const TutoringMaterial = Extension.create<TutoringMaterialOptions>({
  name: "tutoringMaterial",

  addExtensions() {
    const extensions = [];

    // Mandatory extensions
    extensions.push(
      BaseDocument.extend({
        content: "document",
      })
    );
    extensions.push(
      Document.configure({
        isEditor: !!this.options?.isEditor,
      })
    );
    extensions.push(FeedbackExtension);
    extensions.push(TaskExtension);

    // Optional extensions
    if (this.options.image !== false) {
      extensions.push(CustomImage.configure(this.options?.image));
    }

    if (this.options.indent !== false) {
      extensions.push(Indent.configure(this.options?.indent));
    }

    if (this.options.infobox !== false) {
      extensions.push(Infobox.configure(this.options?.infobox));
    }

    // noinspection PointlessBooleanExpressionJS
    if (this.options.math !== false) {
      extensions.push(Math.configure(this.options?.math));
    }

    // Feedbacks
    if (this.options.feedbackHint !== false) {
      extensions.push(FeedbackHint.configure(this.options?.feedbackHint));
    }

    if (this.options.feedbackMark !== false) {
      extensions.push(
        FeedbackMark.configure({
          ...(!!this.options?.feedbackMark ? this.options?.feedbackMark : {}),
          showOutline: !!this.options?.isEditor,
        })
      );
    }

    if (this.options.feedbackNotification !== false) {
      extensions.push(FeedbackNotification.configure(this.options?.feedbackNotification));
    }

    // Tasks
    if (this.options.taskSingleChoice !== false) {
      extensions.push(TaskSingleChoice.configure(this.options?.taskSingleChoice));
    }

    if (this.options.taskMultipleChoice !== false) {
      extensions.push(TaskMultipleChoice.configure(this.options?.taskMultipleChoice));
    }

    return extensions;
  },
});
