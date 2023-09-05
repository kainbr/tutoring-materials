<template>
  <TaskScaffold contenteditable="false" :editor="editor">
    <!-- Render -->
    <template #render>
      <div v-if="!editor.isEditable && !!content?.img" class="flex justify-center">
        <canvas ref="canvas" class="max-w-full cursor-pointer" @click="submitAnswer">
          <img ref="image" :src="content.img" alt="image" @load="initCanvas()" />
        </canvas>
      </div>
    </template>

    <!-- Content -->
    <template #content>
      <div v-if="editor.isEditable">
        <canvas ref="canvas" class="w-full px-28 m-0">
          <img
            v-if="!!content?.img"
            ref="image"
            :src="content.img"
            alt="image"
            @load="initCanvas()"
          />
        </canvas>
        <div class="flex w-full justify-center">
          <span>Width: {{ image?.naturalWidth }} - Height: {{ image?.naturalHeight }}</span>
        </div>
        <div class="flex flex-row justify-between">
          <span></span>
          <EditorMenuButton :on-inactive-click="showFileModal">
            <IconUpload />
          </EditorMenuButton>
        </div>
        <div v-if="content?.regions">
          <div v-for="region in content.regions" :key="region.id" class="flex flex-col w-full">
            <div class="flex flex-row w-full">
              <div class="mr-2">
                <span v-html="getHexIconLabel(region.id)"></span>
              </div>
              <div class="w-full">
                <div class="flex flex-row">
                  <select
                    v-model="region.type"
                    disabled
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg block w-full p-1"
                  >
                    <option value="rect" disabled>Rectangle</option>
                  </select>
                  <div class="flex flex-row mx-1.5 gap-1.5">
                    <!--
                    TODO: Add function to toggle this value
                    @input="toggleEvaluationOptionValue(option)"
                    -->
                    <input
                      :checked="evaluation.solution.find((s) => s.id === region.id)?.value || false"
                      type="checkbox"
                      class="mx-1 my-2"
                      :disabled="content.regions.length <= 1"
                    />
                    Correct
                  </div>
                </div>
                <component
                  :is="region.type"
                  :region="region"
                  @update:region="updateRegionAttributes(region.id, $event)"
                ></component>
              </div>
            </div>
          </div>
        </div>
        <!-- Upload Modal -->
        <UploadModal v-model="fileModalOpen" @update:image="updateImage" />
      </div>
    </template>

    <!-- Evaluation -->
    <template #evaluation>
      <OptionsFormEnum
        v-if="!!evaluation"
        name="evaluationName"
        :value="evaluation.name"
        :options="
          evaluationOptions.map((o) => {
            return { value: o.name, label: o.label };
          })
        "
        :label="$t('editor.task.evaluation-label-type')"
        @update:value="updateEvaluationName"
      />
    </template>

    <!-- Options -->
    <template #options>
      <div v-if="options" class="mt-1 flex flex-col gap-1.5">
        <OptionsDefaults
          :options="options"
          has-max-attempts
          has-disabled-check-timer
          has-disabled-next-timer
          has-submit-button
          has-feedback-button
          has-next-button
          has-correct-state
          has-incorrect-state
          has-final-incorrect-state
          @update:options="update({ options: $event })"
        />
      </div>
    </template>
  </TaskScaffold>
</template>

<script lang="ts">
// import {  inject } from "vue";
import { defineComponent, inject, ref, watch } from "vue";
import { useTask } from "@/extensions/task/helpers";
import { formatOptions } from "@/extensions/task/find-hotspots/format/options";
import { formatContent } from "@/extensions/task/find-hotspots/format/content";
import TaskScaffold from "@/extensions/task/helpers/TaskScaffold.vue";
import UploadModal from "@/extensions/task/find-hotspots/UploadModal.vue";

import type { PropType } from "vue";
import type {
  FHContent,
  FHEvaluation,
  FHOptions,
  FHState,
  FHProps,
  FHEmits,
  FHRegion,
} from "@/extensions/task/find-hotspots/types";
import type { Editor } from "@tiptap/vue-3";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconUpload from "@/helpers/icons/IconUpload.vue";
import { calculateHexIcon } from "@/helpers/util";
import Rect from "@/extensions/task/find-hotspots/regions/Rect.vue";
import {
  formatEvaluation,
  evaluationOptions,
} from "@/extensions/task/find-hotspots/format/evaluation";
import { formatState } from "@/extensions/task/find-hotspots/format/state";
import type { InjectedSubmit } from "@/extensions/task/base/TaskComponent.vue";
import OptionsDefaults from "@/extensions/task/helpers/OptionsDefaults.vue";
import OptionsFormEnum from "@/extensions/task/helpers/OptionsFormEnum.vue";
import { formatEvents } from "@/extensions/task/find-hotspots/format/events";
// import type { InjectedEventBus } from "@/helpers/useEventBus";

export default defineComponent({
  name: "TaskFindHotspots",

  components: {
    EditorMenuButton,
    IconUpload,
    OptionsDefaults,
    OptionsFormEnum,
    Rect,
    TaskScaffold,
    UploadModal,
  },

  props: {
    id: {
      type: String,
      required: true,
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    options: {
      type: Object as PropType<FHOptions>,
      default() {
        return {};
      },
    },
    content: {
      type: Object as PropType<FHContent>,
      default() {
        return {};
      },
    },
    evaluation: {
      type: Object as PropType<FHEvaluation>,
      default() {
        return {};
      },
    },
    state: {
      type: Object as PropType<FHState>,
      default() {
        return {};
      },
    },
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    // const { eventBus } = inject("eventBus") as InjectedEventBus;
    const { submit } = inject("submit") as InjectedSubmit;

    const { update } = useTask<FHProps, FHEmits, FHOptions, FHContent, FHEvaluation, FHState>(
      props,
      emit,
      [formatOptions, formatContent, formatEvaluation, formatState, formatEvents]
    );

    const updateEvaluationName = (newName: string) => {
      switch (newName) {
        case "all-match":
        default:
          update({
            evaluation: {
              name: newName,
              solution:
                !!props.evaluation && !!props.evaluation.solution ? props.evaluation.solution : [],
            },
          });
      }
    };

    const initCanvas = () => {
      if (!canvas.value || !image.value) return console.info("No image or canvas found");
      canvas.value.width = image.value.naturalWidth;
      canvas.value.height = image.value.naturalHeight;

      const ctx = canvas.value.getContext("2d");
      const background = new Image();
      background.src = image.value.src;
      ctx.drawImage(background, 0, 0);

      // Draw regions
      if (props.editor.isEditable || ["correct", "final-incorrect", "solution"].includes(props.state?.state)) {
        props.content?.regions.forEach((region) => {
          switch (region.type) {
            case "rect":
              ctx.beginPath();
              ctx.lineWidth = "8";
              ctx.strokeStyle = "red";
              ctx.rotate(((region.config.rotation || 0) * Math.PI) / 180);
              ctx.rect(region.config.x, region.config.y, region.config.width, region.config.height);
              ctx.rotate(-((region.config.rotation || 0) * Math.PI) / 180);
              ctx.stroke();
          }
        });
      }
    };

    const updateRegionAttributes = (regionId: string, attributes: Partial<FHRegion>) => {
      update({
        content: {
          ...props.content,
          regions:
            props.content?.regions.map((region) => {
              return { ...region, ...(region.id === regionId ? attributes : {}) };
            }) || [],
        },
      });
    };

    // Image upload
    const fileModalOpen = ref(false);

    const showFileModal = () => {
      fileModalOpen.value = true;
    };

    const updateImage = (image: string) => {
      update({
        content: {
          ...props.content,
          img: image,
        },
      });
    };

    const canvas = ref();
    const image = ref();
    const hovering = ref(false);

    watch(
      [() => props.content, () => props.state],
      () => {
        if (canvas.value && image.value) initCanvas();
      },
      { deep: true }
    );

    const getHexIconLabel = (id: string) => {
      return calculateHexIcon(id);
    };

    const submitAnswer = ($event: MouseEvent) => {
      if (["correct", "final-incorrect", "solution"].includes(props.state?.state)) return;

      const rect = canvas.value.getBoundingClientRect();
      const scaleX = canvas.value.width / rect.width;
      const scaleY = canvas.value.height / rect.height;

      const P = {
        x: ($event.clientX - rect.left) * scaleX,
        y: ($event.clientY - rect.top) * scaleY,
      };

      const clickedRegions: string[] = [];

      props.content?.regions.forEach((region) => {
        // https://stackoverflow.com/questions/17136084/checking-if-a-point-is-inside-a-rotated-rectangle
        switch (region.type) {
          case "rect":
            const rotatePointFromOrigin = (
              p: { x: number; y: number },
              degree: number
            ): { x: number; y: number } => {
              return {
                x:
                  p.x * Math.cos((degree * Math.PI) / 180) -
                  p.y * Math.sin((degree * Math.PI) / 180),
                y:
                  p.x * Math.sin((degree * Math.PI) / 180) +
                  p.y * Math.cos((degree * Math.PI) / 180),
              };
            };

            const calculateAreaTriangle = (
              A: { x: number; y: number },
              B: { x: number; y: number },
              C: { x: number; y: number }
            ) => {
              return (
                Math.abs(
                  B.x * A.y - A.x * B.y + (C.x * B.y - B.x * C.y) + (A.x * C.y - C.x * A.y)
                ) / 2
              );
            };

            const areaRect = region.config.width * region.config.height;

            const A = rotatePointFromOrigin(
              { x: region.config.x, y: region.config.y },
              region.config.rotation || 0
            );
            const B = rotatePointFromOrigin(
              { x: region.config.x + region.config.width, y: region.config.y },
              region.config.rotation || 0
            );
            const C = rotatePointFromOrigin(
              { x: region.config.x, y: region.config.y + region.config.height },
              region.config.rotation || 0
            );
            const D = rotatePointFromOrigin(
              {
                x: region.config.x + region.config.width,
                y: region.config.y + region.config.height,
              },
              region.config.rotation || 0
            );

            const areaSumTriangles =
              calculateAreaTriangle(A, P, D) +
              calculateAreaTriangle(D, P, C) +
              calculateAreaTriangle(C, P, B) +
              calculateAreaTriangle(P, B, A);

            if (areaSumTriangles < areaRect) clickedRegions.push(region.id);
            break;
          default:
            return;
        }
      });

      submit({ ...props.state, answer: { position: P, clickedRegions } });
    };

    return {
      canvas,
      evaluationOptions,
      fileModalOpen,
      hovering,
      image,
      update,
      initCanvas,
      getHexIconLabel,
      showFileModal,
      submitAnswer,
      updateEvaluationName,
      updateImage,
      updateRegionAttributes,
    };
  },
});
</script>
