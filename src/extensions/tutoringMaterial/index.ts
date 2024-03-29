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
import { TaskExtension } from "@/extensions/task";
import { TaskSingleChoice } from "@/extensions/task/single-choice";
import { TaskMultipleChoice } from "@/extensions/task/multiple-choice";
import { TaskTrueFalse } from "@/extensions/task/true-false";
import { TaskFillTheBlank } from "@/extensions/task/fill-the-blank";
import { TaskFindHotspots } from "@/extensions/task/find-hotspots";
import { TaskMapping } from "@/extensions/task/mapping";
import type { IndentOptions } from "@/extensions/indent";
import { TaskShortText } from "@/extensions/task/short-text";

export interface TutoringMaterialOptions {
  isEditor: boolean;
  image: false;
  indent: Partial<IndentOptions> | false;
  infobox: false;
  feedbackHint: false;
  feedbackMark: false;
  feedbackNotification: false;
  taskSingleChoice: false;
  taskMultipleChoice: false;
  taskTrueFalse: false;
  taskFillTheBlank: false;
  taskFindHotspots: false;
  taskMapping: false;
  taskShortText: false;
}

export const TutoringMaterial = Extension.create<TutoringMaterialOptions>({
  name: "tutoringMaterial",

  addExtensions() {
    const extensions = [];

    // Mandatory extensions
    extensions.push(
      BaseDocument.extend({
        content: "document"
      })
    );
    extensions.push(
      Document.configure({
        isEditor: !!this.options?.isEditor
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

    // Feedbacks
    if (this.options.feedbackHint !== false) {
      extensions.push(FeedbackHint.configure(this.options?.feedbackHint));
    }

    if (this.options.feedbackMark !== false) {
      extensions.push(
        FeedbackMark.configure({
          ...(!!this.options?.feedbackMark ? this.options?.feedbackMark : {}),
          showOutline: !!this.options?.isEditor
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

    if (this.options.taskTrueFalse !== false) {
      extensions.push(TaskTrueFalse.configure(this.options?.taskTrueFalse));
    }

    if (this.options.taskFillTheBlank !== false) {
      extensions.push(TaskFillTheBlank.configure(this.options?.taskFillTheBlank));
    }

    if (this.options.taskFindHotspots !== false) {
      extensions.push(TaskFindHotspots.configure(this.options?.taskFindHotspots));
    }

    if (this.options.taskMapping !== false) {
      extensions.push(TaskMapping.configure(this.options?.taskMapping));
    }

    if (this.options.taskShortText !== false) {
      extensions.push(TaskShortText.configure(this.options?.taskShortText));
    }

    return extensions;
  }
});
