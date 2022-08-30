<template>
  <!-- Use an extra div to register ResizeObserver after mounting, but when the editor component is not mounted yet. -->
  <div ref="container" class="h-full w-full">
    <!-- Main container-->
    <div
      v-if="editor"
      :class="{ 'border-2 shadow rounded-lg': isEditor }"
      class="flex flex-col h-full w-full"
    >
      <!-- Conditional menu -->
      <EditorMenu v-if="isEditor" :editor="editor" />

      <!-- Main content -->
      <EditorContent
        :class="editorContainerClasses"
        :editor="editor"
        class="w-full h-full mx-auto z-0 p-4 prose [&_p]:mt-0 [&_h2]:mt-0 [&_h3]:mt-0 [&_blockquote]:mt-0 [&_pre]:mt-0 [&_ul]:mt-0 [&_ol]:mt-0 [&_li]:mt-0"
      >
      </EditorContent>

      <!-- Conditional footer -->
      <EditorFooter v-if="isEditor" :editor="editor" class="border-t-2" />

      <!-- Feedback notification container -->
      <div
        :class="{ 'mt-[5.5rem]': isEditor }"
        class="absolute z-0 border-0 h-0"
        :style="'width: ' + width + 'px'"
      >
        <NotificationContainerComponent :editor="editor"></NotificationContainerComponent>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Vue imports
import { defineComponent, onBeforeUnmount, onMounted, ref, watch } from "vue";
import { findChildren } from "@tiptap/core";
import { useI18n } from "vue-i18n";
import { isEqual } from "lodash-es";
import EditorMenu from "@/helpers/EditorMenu.vue";

// Editor imports
import { Editor, EditorContent } from "@tiptap/vue-3";
import { Document as BaseDocument } from "@tiptap/extension-document";
import StarterKit from "@tiptap/starter-kit";
import { Color } from "@tiptap/extension-color";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Subscript } from "@tiptap/extension-subscript";
import { Superscript } from "@tiptap/extension-superscript";
import { TextAlign } from "@tiptap/extension-text-align";
import { TextStyle } from "@tiptap/extension-text-style";
import { Typography } from "@tiptap/extension-typography";
import { Underline } from "@tiptap/extension-underline";

// Custom editor extensions
import { Document } from "@/extensions/document";
import { Indent } from "@/extensions/indent";
import { Infobox } from "@/extensions/infobox";
import { CustomImage } from "@/extensions/image";
import EditorFooter from "@/helpers/EditorFooter.vue";
import NotificationContainerComponent from "@/extensions/feedback/notification/NotificationContainerComponent.vue";

import { Task } from "@/extensions/task";
import { SingleChoiceTask } from "@/extensions/task/single-choice";

import { FeedbackExtension } from "@/extensions/feedback";
import { FeedbackHint } from "@/extensions/feedback/hint";
import { FeedbackMark } from "@/extensions/feedback/mark";
import { FeedbackNotification } from "@/extensions/feedback/notification";

import type { PropType } from "vue";
import type { JSONContent } from "@tiptap/vue-3";
import type { DocumentState, EmittedEvent, Event } from "@/extensions/document/types";
import type { Feedback } from "@/extensions/feedback/types";

export default defineComponent({
  components: {
    NotificationContainerComponent,
    EditorFooter,
    EditorContent,
    EditorMenu,
  },

  props: {
    content: {
      type: Object as PropType<JSONContent>,
      default() {
        return {
          type: "doc",
          content: [
            {
              type: "document",
              content: [
                {
                  type: "paragraph",
                },
              ],
            },
          ],
        };
      },
    },

    state: {
      type: Object as PropType<DocumentState>,
      default() {
        return {};
      },
    },

    isEditor: {
      type: Boolean,
      default: false,
    },

    taskLimit: {
      type: Number,
      default: -1,
    },
  },

  emits: ["update:content", "update:state", "event"],

  setup(props, context) {
    // Meta information
    const startTimestamp: number = Date.now();
    // eslint-disable-next-line vue/no-setup-props-destructure
    const receivedContent = props.content;
    // eslint-disable-next-line vue/no-setup-props-destructure
    const receivedState = props.state;

    onMounted(() => {
      if (!editor.isEditable) {
        editor.storage.document.eventBus().emit("document-created", {
          type: "document-created",
          parent: null,
          facts: {},
          data: {
            startTimestamp: startTimestamp,
            endTimestamp: Date.now(),
            receivedContent: receivedContent,
            receivedState: receivedState,
          },
          label: {
            message: "global.event.type-document-created",
          },
        });
      }
    });

    onBeforeUnmount(() => {
      // Since the storage is shared, filter out rendered tasks from storage
      // before unmounting to emit created events again on recreate / refresh.
      const taskIds = findChildren(editor.state.doc, (n) => n.type.name === "task").map(
        (n) => n.node.attrs.id
      );
      editor.storage.tasks.rendered = editor.storage.tasks.rendered.filter(
        (taskId: string) => !taskIds.includes(taskId)
      );
    });

    // Editor
    const { t, locale } = useI18n();

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

    // Register event bus
    editor.storage.document.eventBus().on("*", (type: string, e: Event) => {
      context.emit("event", {
        type: type,
        ts: Date.now(),
        facts: e.facts,
        data: e.data,
        label: e.label,
      } as EmittedEvent);
    });

    watch(
      () => props.content,
      (content) => {
        if (!isEqual(content, editor.getJSON())) {
          if (!content) {
            content = {
              type: "doc",
              content: [
                {
                  type: "document",
                  content: [
                    {
                      type: "paragraph",
                    },
                  ],
                },
              ],
            };
          }
          editor.commands.setContent(content, true);
        }
      },
      { deep: true }
    );

    watch(
      [() => props.state.tasks, () => props.state.feedbacks],
      ([tasks, feedbacks]) => {
        if (!isEqual(tasks, editor.storage.tasks.taskStates)) {
          editor.storage.tasks.taskStates = tasks;
        }
        if (!isEqual(feedbacks, editor.storage.feedbacks.active)) {
          // editor.storage.feedbacks.active = feedbacks;
          const feedbackIds = feedbacks.map((feedback: Feedback) => feedback.id);

          editor.storage.feedbacks.active
            .filter((feedback: Feedback) => !feedbackIds.includes(feedback.id))
            .forEach((feedback: Feedback) => {
              editor.commands.removeActiveFeedback(feedback);
            });

          feedbacks.forEach((feedback: Feedback) => {
            editor.commands.addActiveFeedback(feedback);
          });
        }
      },
      { deep: true }
    );

    onBeforeUnmount(() => {
      editor.destroy();
    });

    watch(
      [() => editor.storage.tasks.taskStates, () => editor.storage.feedbacks.active],
      ([states, feedbacks], [oldStates, oldFeedbacks]) => {
        if (!isEqual(states, oldStates) || !isEqual(feedbacks, oldFeedbacks)) {
          context.emit("update:state", {
            tasks: states,
            feedbacks: feedbacks,
          });

          editor.setOptions({
            editorProps: {
              attributes: {
                style: editor.storage["feedback-mark"].getStyleVariables(),
                class: "h-full",
              },
            },
          });
        }
      },
      { deep: true, immediate: true }
    );

    // Content sizing
    const container = ref<HTMLInputElement | null>(null);
    const width = ref(0);
    const height = ref(0);
    const editorContainerClasses = ref([props.isEditor ? "overflow-y-auto h-full" : ""]);

    onMounted(() => {
      const ro = new ResizeObserver(() => {
        height.value = container?.value?.clientHeight || 0;
        width.value = container?.value?.clientWidth || 0;

        editorContainerClasses.value = [
          props.isEditor ? "overflow-y-auto h-full" : "",
          width.value < 500 ? "prose-sm" : "",
          width.value >= 500 && width.value < 900 ? "prose-base" : "",
          width.value >= 900 ? "prose-lg" : "",
        ];
      });
      if (container.value) {
        ro.observe(container.value);
      }
    });

    return {
      t,
      editor,
      container,
      editorContainerClasses,
      width,
      height,
    };
  },
});
</script>
