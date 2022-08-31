<!--suppress JSUnusedGlobalSymbols -->
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
import { defineComponent, onBeforeUnmount, onMounted } from "vue";
import { findChildren } from "@tiptap/core";
import EditorMenu from "@/helpers/EditorMenu.vue";

import { EditorContent } from "@tiptap/vue-3";
import EditorFooter from "@/helpers/EditorFooter.vue";
import NotificationContainerComponent from "@/extensions/feedback/notification/NotificationContainerComponent.vue";

import type { DocumentState } from "@/extensions/document/types";
import type { JSONContent } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { TaskOptions } from "@/extensions/task/types";
import useEditor from "@/helpers/useEditor";
import useDefaults from "@/helpers/useDefaults";
import useContainerSizing from "@/helpers/useContainerSizing";
import useEventBus from "@/helpers/useEventBus";
import useTasks from "@/helpers/useTasks";
import useProps from "@/helpers/useProps";

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
      validator(value: number) {
        return value >= -1 && Number.isInteger(value);
      },
    },

    taskOptions: {
      type: Object as PropType<Partial<TaskOptions>>,
      default() {
        return {};
      },
    },
  },

  emits: ["update:content", "update:state", "event"],

  setup(props, context) {
    useDefaults(props);
    const { container, width, height, editorContainerClasses } = useContainerSizing(props);
    const { editor } = useEditor(props, context);
    const { eventBus } = useEventBus(editor, context);
    const { taskStates } = useTasks();
    useProps(editor, taskStates, props, context);

    // Meta information
    const startTimestamp: number = Date.now();
    // eslint-disable-next-line vue/no-setup-props-destructure
    const receivedContent = props.content;
    // eslint-disable-next-line vue/no-setup-props-destructure
    const receivedState = props.state;

    onMounted(() => {
      eventBus.emit("interaction", {
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

    return {
      editor,
      container,
      editorContainerClasses,
      width,
      height,
    };
  },
});
</script>
