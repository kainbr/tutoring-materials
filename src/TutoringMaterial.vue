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

      <!-- Scaffold notification container
      -->
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
import { onBeforeUnmount, onMounted, ref, watch } from "vue";
import EditorMenu from "@/helpers/EditorMenu.vue";

// Editor imports
import type { Content, JSONContent } from "@tiptap/vue-3";
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
import NotificationContainerComponent from "@/scaffolds/notification/NotificationContainerComponent.vue";
import { ScaffoldNotification } from "@/scaffolds/notification";
import { ScaffoldMark } from "@/scaffolds/mark";

interface Props {
  readonly taskLimit: number;
  readonly isEditor: boolean;
  readonly state: object | undefined;
  readonly content: object | undefined;
}

export default {
  components: {
    NotificationContainerComponent,
    EditorFooter,
    EditorContent,
    EditorMenu,
  },
  props: {
    content: {
      type: Object,
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
      type: Object,
      default() {
        return undefined;
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

  setup(props: Props, context: { emit: (arg0: string, arg1: JSONContent) => void }) {
    // Editor
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
          placeholder: "Some content...",
        }),
        TextAlign.configure({
          types: ["heading", "paragraph", "image"],
        }),

        // Custom Extensions
        Indent,
        CustomImage,
        Infobox,
        ScaffoldNotification,
        ScaffoldMark.configure({ showOutline: props.isEditor }),
        /*
          Task,
           */
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

        editor.storage.document.eventBus.emit("document-created", {});
      },
      onUpdate: () => {
        if (props.isEditor) {
          context.emit("update:content", editor.getJSON());
        }
      },
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
    stateStore.$subscribe((mutation: never, state: JSONContent) => {
      context.emit("update:state", state);
    });

    // TODO: Watch state

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
      editor,
      container,
      editorContainerClasses,
      width,
      height,
    };
  },
};
</script>
