<template>
  <!-- Use an extra div to register ResizeObserver after mounting, but when the editor component is not mounted yet. -->
  <div ref="container" class="h-full w-full">
    <div
      v-if="editor"
      :class="{ 'border-2 shadow rounded-lg': isEditor }"
      class="flex flex-col h-full w-full"
    >
      <EditorMenu v-if="isEditor" :editor="editor" />

      <EditorContent
        :class="editorContainerClasses"
        :editor="editor"
        class="w-full h-full mx-auto z-0 p-4 prose [&_p]:mt-0 [&_h2]:mt-0 [&_h3]:mt-0 [&_blockquote]:mt-0 [&_pre]:mt-0 [&_ul]:mt-0 [&_ol]:mt-0 [&_li]:mt-0"
      >
      </EditorContent>

      <EditorFooter v-if="isEditor" :editor="editor" class="border-t-2" />

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
import { defineComponent, onMounted } from "vue";
import { EditorContent } from "@tiptap/vue-3";
import EditorFooter from "@/helpers/EditorFooter.vue";
import EditorMenu from "@/helpers/EditorMenu.vue";
import NotificationContainerComponent from "@/extensions/feedback/notification/NotificationContainerComponent.vue";

import type { DocumentState } from "@/extensions/document/types";
import type { JSONContent } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { TaskOptions } from "@/extensions/task/types";
import useEditor from "@/helpers/useEditor";
import useDefaults from "@/helpers/useDefaults";
import useContainerDimensions from "@/helpers/useContainerDimensions";
import useEventBus from "@/helpers/useEventBus";
import useTasks from "@/helpers/useTasks";
import useProps from "@/helpers/useProps";
import useFeedbacks from "@/helpers/useFeedbacks";

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
        return {
          tasks: [],
          feedbacks: [],
        };
      },
    },

    isEditor: {
      type: Boolean,
      default: false,
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
    const startTimestamp: number = Date.now();

    // Run helpers functions. Order matters!
    useDefaults(props);
    const { container, width, height, editorContainerClasses } = useContainerDimensions(props);
    const { editor } = useEditor(props, context);
    const { taskStates } = useTasks(editor);
    const { activeFeedbacks, addActiveFeedback, removeActiveFeedback } = useFeedbacks();
    const { eventBus } = useEventBus(editor, context, addActiveFeedback);
    useProps(
      editor,
      props,
      context,
      taskStates,
      activeFeedbacks,
      addActiveFeedback,
      removeActiveFeedback
    );

    // Emit document created event after mounting process finished
    onMounted(() => {
      editor.commands.addEventOption({
        name: "document-created",
        parent: null,
        conditions: [],
        label: { message: "global.event.type-document-created" },
      });

      eventBus.emit("interaction", {
        type: "document-created",
        parent: null,
        facts: {},
        data: {
          startTimestamp: startTimestamp,
          endTimestamp: Date.now(),
        },
        label: {
          message: "global.event.type-document-created",
        },
      });
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
