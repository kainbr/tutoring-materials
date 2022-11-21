<template>
  <div class="p-4 border-2 rounded-xl text-center my-2 relative [&_img]:my-0">
    <InlineEditor :content="content" @input-up-event="cancelDragging" allow-images />

    <div
      class="absolute z-10 inset-y-0 right-0 inline-flex flex-col justify-center"
      ref="containerRef"
    >
      <div
        class="p-0 z-0"
        :class="[isDragging ? 'cursor-grab' : 'cursor-pointer', isDragging ? 'drop-shadow-md' : '']"
        :style="{
          transform: 'translate(' + (xTransform + 17) + 'px, ' + yTransform + 'px)',
        }"
        @mousedown="onInputStart"
        @touchstart.passive="onInputStart"
        @mouseup.prevent="onInputEnd"
        @touchend.passive="onInputEnd"
      >
        <div class="p-1 border-2 w-8 h-8 rounded-full bg-green-300" ref="handleRef"></div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, watchEffect } from "vue";
import InlineEditor from "@/helpers/InlineEditor.vue";
import LeaderLine from "leader-line-new";

import type { JSONContent } from "@tiptap/vue-3";
import type { PropType } from "vue";

export default defineComponent({
  name: "SourceOption",

  components: {
    InlineEditor,
  },

  emits: ["startDragging", "updateDraggingPosition", "stopDragging", "cancelDragging"],

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
    disabled: {
      type: Boolean,
      default: true,
    },
  },

  setup(props, context) {
    let leaderLine: LeaderLine;
    const handleRef = ref(null);
    const containerRef = ref(null);
    const xTransform = ref(0);
    const yTransform = ref(0);
    const xDragStart = ref(0);
    const yDragStart = ref(0);
    const isDragging = ref(false);

    const onInputStart = (e: MouseEvent | TouchEvent) => {
      if (!props.disabled) {
        e.stopPropagation();
        let { clientX, clientY } = e instanceof TouchEvent ? e.targetTouches[0] : e;
        isDragging.value = true;
        xDragStart.value = clientX;
        yDragStart.value = clientY;
        if (!!leaderLine) {
          leaderLine.position();
          leaderLine.show("none");
        }
        document.addEventListener(e instanceof TouchEvent ? "touchmove" : "mousemove", onInputMove);
        context.emit("startDragging");
      }
    };

    const onInputMove = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      let { clientX, clientY } = e instanceof TouchEvent ? e.targetTouches[0] : e;
      if (isDragging.value) {
        xTransform.value = clientX - xDragStart.value;
        yTransform.value = clientY - yDragStart.value;
        if (!!leaderLine) {
          leaderLine.position();
        }
        context.emit("updateDraggingPosition", {
          clientX,
          clientY,
        });
      }
    };

    const onInputEnd = (e: MouseEvent | TouchEvent) => {
      e.stopPropagation();
      isDragging.value = false;
      xDragStart.value = 0;
      yDragStart.value = 0;
      xTransform.value = 0;
      yTransform.value = 0;
      if (!!leaderLine) {
        leaderLine.hide("none");
        leaderLine.position();
      }
      document.removeEventListener(
        e instanceof TouchEvent ? "touchmove" : "mousemove",
        onInputMove
      );
      context.emit("stopDragging");
    };

    watchEffect(() => {
      if (!!containerRef.value && !!handleRef.value) {
        if (!!leaderLine) {
          leaderLine.remove();
        }
        leaderLine = new LeaderLine(containerRef.value, handleRef.value, {
          startPlug: "behind",
          startSocket: "right",
          endPlug: "behind",
          endSocket: "left",
          color: "#38bdf8",
          hide: true,
          dash: { animation: true },
        });
      }
    });

    const cancelDragging = (e: MouseEvent | TouchEvent) => {
      context.emit("cancelDragging", e);
    };

    return {
      handleRef,
      containerRef,
      xTransform,
      yTransform,
      isDragging,
      onInputStart,
      onInputEnd,
      cancelDragging,
    };
  },
});
</script>
