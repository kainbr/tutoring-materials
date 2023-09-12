<template>
  <div ref="containerRef" class="relative p-2.5 shadow border rounded-xl text-center my-1.5 [&_img]:my-0 text-xs">
    <InlineEditor :content="content" @input-up-event="cancelDragging" allow-images />

    <div
      v-if="isConnected"
      class="absolute z-10 inset-y-0 left-0 inline-flex flex-col justify-center"
      :class="[disabled ? 'cursor-default' : 'cursor-pointer']"
      @click="removeConnection"
    >
      <div class="p-0 z-0" :style="{ transform: 'translate(-' + 15 + 'px, ' + 0 + 'px)' }">
        <div class="flex flex-col items-center justify-center w-7 h-7 rounded-full bg-green-400">
          <IconClose v-if="!disabled" class="w-3.5 h-3.5"></IconClose>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import IconClose from "@/helpers/icons/IconClose.vue";
import InlineEditor from "@/helpers/InlineEditor.vue";

import type { Ref, PropType } from "vue";
import type { JSONContent } from "@tiptap/vue-3";

export default defineComponent({
  name: "TargetOption",

  components: {
    IconClose,
    InlineEditor,
  },

  emits: ["cancelDragging", "removeConnection"],

  props: {
    id: {
      type: String,
      required: true,
    },
    content: {
      type: Object as PropType<JSONContent>,
      default() {
        return {};
      },
    },
    isConnected: {
      type: Boolean,
      default: false,
    },
    disabled: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, context) {
    const containerRef: Ref<null | Element> = ref(null);

    const getBoundingClientRect = () => {
      if (!!containerRef.value) {
        return containerRef.value.getBoundingClientRect();
      }
    };

    const cancelDragging = (e: MouseEvent | TouchEvent) => {
      context.emit("cancelDragging", e);
    };

    const removeConnection = () => {
      if (!props.disabled) {
        context.emit("removeConnection");
      }
    };

    return { containerRef, getBoundingClientRect, cancelDragging, removeConnection };
  },
});
</script>
