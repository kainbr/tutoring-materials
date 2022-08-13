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
import { useI18n } from "vue-i18n";
import EditorMenu from "@/helpers/EditorMenu.vue";

// Editor imports
import { Editor, EditorContent } from "@tiptap/vue-3";
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
import { TutoringMaterial } from "@/extensions/tutoring-material";
import { Indent } from "@/extensions/indent";
import { Infobox } from "@/extensions/infobox";
import { CustomImage } from "@/extensions/image";
import EditorFooter from "@/helpers/EditorFooter.vue";
import NotificationContainerComponent from "@/feedbacks/notification/NotificationContainerComponent.vue";
import { FeedbackNotification } from "@/feedbacks/notification";
import { FeedbackMark } from "@/feedbacks/mark";
import { Task } from "@/extensions/task";

import type { PropType } from "vue";
import type { Content, JSONContent } from "@tiptap/vue-3";
import type { TaskState } from "@/tasks/types";

interface Props {
  readonly taskLimit: number;
  readonly isEditor: boolean;
  readonly state: object | undefined;
  readonly content: object | undefined;
}

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
          type: "tutoring-material",
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
      type: Object as PropType<TaskState>,
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

  setup(props: Props, context) {
    // Meta information
    const startTimestamp: number = Date.now();
    // eslint-disable-next-line vue/no-setup-props-destructure
    const receivedContent = props.content;
    // eslint-disable-next-line vue/no-setup-props-destructure
    const receivedState = props.state;

    onMounted(() => {
      editor.storage.document.eventBus.emit("document-created", {
        startTimestamp: startTimestamp,
        endTimestamp: Date.now(),
        receivedContent: receivedContent,
        receivedState: receivedState,
      });
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
        Color,
        Subscript,
        Superscript,
        TextStyle,
        Typography,
        Underline,
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
        // Image,
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
        FeedbackNotification,
        FeedbackMark.configure({ showOutline: props.isEditor }),
        Task,
        TutoringMaterial,
        Document.configure({
          isEditor: props.isEditor,
          taskLimit: props.taskLimit,
        }),
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
    editor.storage.document.eventBus.on("*", (type: string, e: object) =>
      context.emit("event", { ts: Date.now(), type: type, data: e })
    );

    watch(
      () => props.content,
      (newContent: Content) => {
        if (JSON.stringify(editor.getJSON()) !== JSON.stringify(newContent)) {
          editor.commands.setContent(newContent, true);
        }
      },
      { deep: true }
    );

    onBeforeUnmount(() => {
      editor.destroy();
    });

    // Store
    const stateStore = editor.storage.document.stateStore();
    context.emit("update:state", stateStore.$state);

    stateStore.$subscribe((mutation: never, state: JSONContent) => {
      context.emit("update:state", state);
    });

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
