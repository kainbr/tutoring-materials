<template>
  <!-- Player dimension selectable -->
  <div
    v-for="(value, index) in isPortrait
      ? [...playerDimensions].sort((a, b) => b.width - a.width)
      : [...playerDimensions].sort((a, b) => b.height - a.height)"
    :key="value.label"
    :class="['z-[' + index + '] ' + (index !== 0 ? 'border-x-2' : '')]"
    :style="'width: ' + (isPortrait ? value.width + 'px' : value.height + 'px')"
    class="absolute left-1/2 transform -translate-x-1/2 bg-gray-200 hover:bg-gray-300 h-5 border-slate-50 cursor-pointer"
    @click="updateDimensions(value.width, value.height)"
    @mouseleave="hoverLabel = null"
    @mouseover="hoverLabel = value.label"
  ></div>
  <div class="absolute left-1/2 transform -translate-x-1/2 z-50 text-sm select-none">
    {{ hoverLabel }}
  </div>

  <div class="w-full py-4 mt-3">
    <!-- Button group -->
    <div class="flex w-full items-center justify-end mb-2 px-2">
      <span class="relative z-0 inline-flex shadow-sm rounded-sm">
        <button
          class="relative inline-flex items-center px-3 py-1.5 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          type="button"
          @click="rotatePortrait"
        >
          <IconRotateLeft class="-ml-1 mr-1 h-4 w-4 text-gray-400" />
          {{ $t("preview.button-rotate-player") }}
        </button>
        <button
          class="relative inline-flex items-center px-3 py-1.5 border-y border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          type="button"
          @click="sendNotification"
        >
          <IconMessage class="-ml-1 mr-1 h-4 w-4 text-gray-400" />
          {{ $t("preview.button-send-notification") }}
        </button>
        <button
          class="-ml-px relative inline-flex items-center px-3 py-1.5 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          type="button"
          @click="resetPlayer"
        >
          <IconRefresh class="-ml-1 mr-1 h-4 w-4 text-gray-400" />
          {{ $t("preview.button-reset-task") }}
        </button>
      </span>
    </div>
    <!-- Main player -->
    <div
      :style="
        'height: ' +
        (isPortrait ? height + 'px' : width + 'px') +
        '; width: ' +
        (isPortrait ? width + 'px' : height + 'px')
      "
      class="border border-2 rounded-lg overflow-auto mx-auto bg-white transition-all duration-500"
    >
      <tutoring-material-player
        :key="previewKey"
        :content="content"
        :state="state"
        @update:state="updateState"
        @event="$emit('event', $event)"
      ></tutoring-material-player>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import IconRotateLeft from "@/helpers/icons/IconRotateLeft.vue";
import IconRefresh from "@/helpers/icons/IconRefresh.vue";
import IconMessage from "@/helpers/icons/IconMessage.vue";
import TutoringMaterialPlayer from "@/TutoringMaterialPlayer.vue";

import type { JSONContent } from "@tiptap/vue-3";
import type { PropType } from "vue";
import type { DocumentState } from "@/extensions/document/types";
import type { TaskState } from "@/extensions/task/types";
import type { Feedback } from "@/extensions/feedback/types";

export default defineComponent({
  name: "TutoringMaterialPreview",

  components: {
    IconMessage,
    IconRefresh,
    IconRotateLeft,
    TutoringMaterialPlayer,
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
  },

  emits: ["event", "update:state", "reset"],

  data() {
    return {
      previewKey: 0,
      height: 667,
      width: 375,
      isPortrait: true,
      hoverLabel: null as string | null,
      playerDimensions: [
        {
          width: 1280,
          height: 720,
          label: "Laptop",
        },
        {
          width: 768,
          height: 1024,
          label: "Tablet",
        },
        {
          width: 425,
          height: 755,
          label: "Mobile L",
        },
        {
          width: 375,
          height: 667,
          label: "Mobile M",
        },
        {
          width: 320,
          height: 570,
          label: "Mobile S",
        },
      ],
    };
  },

  methods: {
    updateDimensions(width: number, height: number) {
      this.width = width;
      this.height = height;
    },
    rotatePortrait() {
      this.isPortrait = !this.isPortrait;
    },
    resetPlayer() {
      this.$emit("reset");
      this.previewKey += 1;
    },
    updateState($event: { tasks: TaskState[]; feedbacks: Feedback[] }) {
      this.$emit("update:state", $event);
    },
    sendNotification() {
      this.$emit("update:state", {
        tasks: this.state?.tasks,
        feedbacks: [
          ...this.state?.feedbacks,
          {
            id: "test",
            type: "feedback-notification",
            parent: null,
            config: {
              content: {
                type: "doc",
                content: [
                  {
                    type: "paragraph",
                    content: [
                      {
                        type: "text",
                        text: "This is a test message.",
                      },
                    ],
                  },
                ],
              },
            },
          },
        ],
      });
    },
  },
});
</script>
