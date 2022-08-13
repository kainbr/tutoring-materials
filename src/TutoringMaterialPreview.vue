<template>
  <div
    v-for="(value, index) in playerDimensions.isPortrait
      ? [...defaultPlayerDimensions].sort((a, b) => b.sortWidth - a.sortWidth)
      : [...defaultPlayerDimensions].sort((a, b) => b.sortHeight - a.sortHeight)"
    :key="value.label"
    :class="['z-[' + index + '] ' + (index !== 0 ? 'border-x-2' : '')]"
    :style="'width: ' + (playerDimensions.isPortrait ? value.width : value.height)"
    class="absolute left-1/2 transform -translate-x-1/2 bg-slate-200 hover:bg-slate-300 h-5 border-slate-50 cursor-pointer"
    @click="changePlayerDimensions(value.width, value.height)"
    @mouseleave="playerDimensions.hoverLabel = null"
    @mouseover="playerDimensions.hoverLabel = value.label"
  ></div>
  <div class="absolute left-1/2 transform -translate-x-1/2 z-50 text-sm select-none">
    {{ playerDimensions.hoverLabel }}
  </div>
  <div class="w-full py-4 mt-3">
    <div class="flex w-full items-center justify-end mb-2 px-2">
      <span class="relative z-0 inline-flex shadow-sm rounded-sm">
        <button
          class="relative inline-flex items-center px-3 py-1.5 rounded-l-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          type="button"
          @click="playerDimensions.isPortrait = !playerDimensions.isPortrait"
        >
          <svg
            class="-ml-1 mr-1 h-4 w-4 text-gray-400"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M11 9h10a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H11a1 1 0 0 1-1-1V10a1 1 0 0 1 1-1zm1 2v8h8v-8h-8zm-6-.414l1.828-1.829 1.415 1.415L5 14.414.757 10.172l1.415-1.415L4 10.586V8a5 5 0 0 1 5-5h4v2H9a3 3 0 0 0-3 3v2.586z"
            />
          </svg>
          {{ $t("preview.button-rotate-player") }}
        </button>
        <button
          class="-ml-px relative inline-flex items-center px-3 py-1.5 rounded-r-md border border-gray-300 bg-white text-xs font-medium text-gray-700 hover:bg-gray-50 focus:z-10 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
          type="button"
          @click="resetPlayer"
        >
          <svg
            class="-ml-1 mr-1 h-4 w-4 text-gray-400"
            height="24"
            viewBox="0 0 24 24"
            width="24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path d="M0 0h24v24H0z" fill="none" />
            <path
              d="M5.463 4.433A9.961 9.961 0 0 1 12 2c5.523 0 10 4.477 10 10 0 2.136-.67 4.116-1.81 5.74L17 12h3A8 8 0 0 0 6.46 6.228l-.997-1.795zm13.074 15.134A9.961 9.961 0 0 1 12 22C6.477 22 2 17.523 2 12c0-2.136.67-4.116 1.81-5.74L7 12H4a8 8 0 0 0 13.54 5.772l.997 1.795z"
            />
          </svg>
          {{ $t("preview.button-reset-task") }}
        </button>
      </span>
    </div>
    <div
      :style="
        'height: ' +
        (playerDimensions.isPortrait ? playerDimensions.height : playerDimensions.width) +
        '; width: ' +
        (playerDimensions.isPortrait ? playerDimensions.width : playerDimensions.height)
      "
      class="border border-2 rounded-lg overflow-auto mx-auto bg-white transition-all duration-500"
    >
      <tutoring-material-player
        :content="content"
        :state="state"
        @update:state="$emit('update:state', $event)"
        @event="$emit('event', $event)"
      ></tutoring-material-player>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import TutoringMaterialPlayer from "@/TutoringMaterialPlayer.vue";
import type { JSONContent } from "@tiptap/vue-3";
import type { PropType } from "vue";

export default defineComponent({
  name: "TutoringMaterialPreview",

  components: {
    TutoringMaterialPlayer,
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
      type: Object,
      default() {
        return undefined;
      },
    },
  },

  emits: ["update:state", "event", "reset"],

  data() {
    return {
      indexPlayer: 0,
      playerDimensions: {
        width: "375px",
        height: "667px",
        isPortrait: true,
        hoverLabel: null as null | string,
      },
      defaultPlayerDimensions: [
        {
          width: "1280px",
          height: "720px",
          sortWidth: 1280,
          sortHeight: 720,
          label: "Laptop",
        },
        {
          width: "768px",
          height: "1024px",
          sortWidth: 768,
          sortHeight: 1024,
          label: "Tablet",
        },
        {
          width: "425px",
          height: "755px",
          sortWidth: 425,
          sortHeight: 755,
          label: "Mobile L",
        },
        {
          width: "375px",
          height: "667px",
          sortWidth: 375,
          sortHeight: 667,
          label: "Mobile M",
        },
        {
          width: "320px",
          height: "570px",
          sortWidth: 320,
          sortHeight: 570,
          label: "Mobile S",
        },
      ],
    };
  },

  methods: {
    changePlayerDimensions(width: string, height: string) {
      this.playerDimensions = Object.assign({}, this.playerDimensions, {
        width,
        height,
      });
    },
    resetPlayer() {
      this.$emit("reset");
    },
  },
});
</script>
