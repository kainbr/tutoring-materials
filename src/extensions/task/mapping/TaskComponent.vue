<template>
  <TaskScaffold contenteditable="false" :editor="editor">
    <!-- Render -->
    <template #render>
      <div v-if="width < 400" class="text-center">
        {{ $t("editor.task.text-screen-size") }}
      </div>
      <div v-else class="grid grid-cols-3 px-4" @mouseleave="cancelDragging">
        <!-- Start options -->
        <div class="flex flex-col h-full justify-center">
          <SourceOption
            v-for="s in content?.source"
            ref="sourceRefs"
            :key="s.id"
            :id="s.id"
            :class="{ 'bg-amber-300': sourceElement === s.id }"
            :content="s.content"
            :disabled="!!state && ['correct', 'final-incorrect'].includes(state.state)"
            @start-dragging="sourceDragging(s.id)"
            @update-dragging-position="updateDraggingPosition"
            @stop-dragging="stopDragging"
            @cancel-dragging="cancelDragging"
          />
        </div>

        <div></div>

        <!-- End options -->
        <div class="flex flex-col h-full justify-center">
          <TargetOption
            v-for="t in content?.target"
            ref="targetRefs"
            :key="t.id"
            :id="t.id"
            :class="{ 'bg-amber-300': targetElement === t.id, 'cursor-grab': !!sourceElement }"
            :content="t.content"
            :is-connected="!!state.answer.find((a) => a.target === t.id)"
            :disabled="!!state && ['correct', 'final-incorrect'].includes(state.state)"
            @cancel-dragging="cancelDragging"
            @remove-connection="removeConnection(t.id)"
          />
        </div>
      </div>
    </template>

    <!-- Content -->
    <template #content>
      <div class="flex flex-row items-center pb-1">
        <IconArrowRightOnRect class="h-5 pl-4 pr-3"></IconArrowRightOnRect>
        {{ $t("editor.task.mapping.title-source-nodes") }}
      </div>
      <div v-for="(option, index) in content?.source" :key="option.id" class="flex flex-row gap-2">
        <div class="flex flex-row min-w-fit my-1 text-right">
          <span class="px-2 w-10 min-w-fit"> {{ index + 1 }}. </span>
        </div>
        <div class="grow [&_p]:my-1 [&_img]:my-0 max-h-40 overflow-auto my-1">
          <InlineEditor
            is-editor
            allow-images
            :content="option.content"
            @update:content="updateOptionContent(option, $event)"
          />
        </div>
        <div class="min-w-fit">
          <EditorMenuButton
            :disabled="index === 0"
            tabindex="-1"
            @click="moveUpOption(index, option)"
          >
            <IconArrowUp />
          </EditorMenuButton>
          <EditorMenuButton
            :disabled="!content.source || index === content.source.length - 1"
            tabindex="-1"
            @click="moveDownOption(index, option)"
          >
            <IconArrowDown />
          </EditorMenuButton>
          <EditorMenuButton
            :disabled="!content.source || content.source.length <= 1"
            tabindex="-1"
            @click="removeOption(index)"
          >
            <IconTrash />
          </EditorMenuButton>
        </div>
      </div>
      <div>
        <div class="flex flex-row justify-end">
          <div class="flex gap-1">
            <EditorMenuButton @click="addOption(true)">
              <IconAdd />
            </EditorMenuButton>
          </div>
        </div>
      </div>

      <div class="flex flex-row items-center pb-1">
        <IconArrowDownOnSquare class="h-5 pl-4 pr-3"></IconArrowDownOnSquare>
        {{ $t("editor.task.mapping.title-target-nodes") }}
      </div>
      <div v-for="(option, index) in content?.target" :key="option.id" class="flex flex-row gap-2">
        <div class="flex flex-row min-w-fit my-1 text-right">
          <span class="px-2 w-10 min-w-fit"> {{ index + 1 }}. </span>
        </div>
        <div class="grow [&_p]:my-1 [&_img]:my-0 max-h-40 overflow-auto my-1">
          <InlineEditor
            is-editor
            allow-images
            :content="option.content"
            @update:content="updateOptionContent(option, $event, false)"
          />
        </div>
        <div class="min-w-fit">
          <EditorMenuButton
            :disabled="index === 0"
            tabindex="-1"
            @click="moveUpOption(index, option, false)"
          >
            <IconArrowUp />
          </EditorMenuButton>
          <EditorMenuButton
            :disabled="!content.source || index === content.target.length - 1"
            tabindex="-1"
            @click="moveDownOption(index, option, false)"
          >
            <IconArrowDown />
          </EditorMenuButton>
          <EditorMenuButton
            :disabled="
              !content.source ||
              content.target.length <= 1 ||
              content.source.length === content.target.length
            "
            tabindex="-1"
            @click="removeOption(index, false)"
          >
            <IconTrash />
          </EditorMenuButton>
        </div>
      </div>
      <div>
        <div class="flex flex-row justify-end">
          <div class="flex gap-1">
            <EditorMenuButton @click="addOption(false)">
              <IconAdd />
            </EditorMenuButton>
          </div>
        </div>
      </div>

      <div class="flex flex-row items-center pb-1">
        <IconLink class="h-5 pl-4 pr-3"></IconLink>
        {{ $t("editor.task.mapping.title-correct-mappings") }}
      </div>
      <div
        v-if="!!evaluation && !!evaluation.solution"
        v-for="mapping in evaluation.solution"
        :key="mapping.source"
        class="flex flex-row gap-2"
      >
        <div v-if="content" class="grow flex flex-col gap-1 my-1">
          <div class="flex flex-row items-center justify-center">
            <span class="mx-2"> {{ $t("editor.task.mapping.label-source-node") }} </span>
            <select
              v-model="mapping.source"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
              focus:border-blue-500 block py-1 px-2"
              disabled
            >
              <option
                v-for="option in content?.source.filter(
                  (o) =>
                    !evaluation?.solution.find((s) => s.source === o.id && o.id !== mapping.source)
                )"
                :key="option.id"
                :value="option.id"
              >
                {{ content?.source.findIndex((o) => o.id === option.id) + 1 }}.
              </option>
            </select>
            <IconArrowRight></IconArrowRight>
            <select
              :value="mapping.target"
              @input="(e) => updateEvaluationMapping(e, mapping.source)"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500
              focus:border-blue-500 block py-1 px-2"
            >
              <option v-for="option in content?.target" :key="option.id" :value="option.id">
                {{ content?.target.findIndex((o) => o.id === option.id) + 1 }}.
              </option>
            </select>
            <span class="mx-2"> {{ $t("editor.task.mapping.label-target-node") }} </span>
          </div>
        </div>
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
          allow-empty-answer-submission
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
import { computed, defineComponent, inject, onUnmounted, ref, watch } from "vue";
import { formatContent } from "@/extensions/task/mapping/format/content";
import { formatEvaluation, evaluationOptions } from "@/extensions/task/mapping/format/evaluation";
import { formatEvents } from "@/extensions/task/mapping/format/events";
import { formatOptions } from "@/extensions/task/mapping/format/options";
import { formatState } from "@/extensions/task/mapping/format/state";
import { useTask } from "@/extensions/task/helpers";
import { v4 as uuid } from "uuid";
import EditorMenuButton from "@/helpers/EditorMenuButton.vue";
import IconAdd from "@/helpers/icons/IconAdd.vue";
import IconArrowDownOnSquare from "@/helpers/icons/IconArrowDownOnSquare.vue";
import IconArrowDown from "@/helpers/icons/IconArrowDown.vue";
import IconArrowRight from "@/helpers/icons/IconArrowRight.vue";
import IconArrowRightOnRect from "@/helpers/icons/IconArrowRightOnRect.vue";
import IconArrowUp from "@/helpers/icons/IconArrowUp.vue";
import IconLink from "@/helpers/icons/IconLink.vue";
import IconFeedback from "@/helpers/icons/IconFeedback.vue";
import IconShuffle from "@/helpers/icons/IconShuffle.vue";
import IconTrash from "@/helpers/icons/IconTrash.vue";
import InlineEditor from "@/helpers/InlineEditor.vue";
import LeaderLine from "leader-line-new";
import OptionsDefaults from "@/extensions/task/helpers/OptionsDefaults.vue";
import OptionsFormEnum from "@/extensions/task/helpers/OptionsFormEnum.vue";
import SourceOption from "@/extensions/task/mapping/SourceOption.vue";
import TargetOption from "@/extensions/task/mapping/TargetOption.vue";
import TaskScaffold from "@/extensions/task/helpers/TaskScaffold.vue";

import type { Editor } from "@tiptap/vue-3";
import type { InjectedContainerDimensions } from "@/helpers/useContainerDimensions";
import type { JSONContent } from "@tiptap/vue-3";
import type {
  MAPEvaluation,
  MAPOptions,
  MAPState,
  MAPProps,
  MAPEmits,
  MAPContent,
  MAPOption
} from "@/extensions/task/mapping/types";
import type { PropType, Ref } from "vue";

export default defineComponent({
  name: "TaskMapping",

  components: {
    IconArrowRight,
    IconLink,
    TargetOption,
    IconArrowDownOnSquare,
    IconArrowRightOnRect,
    SourceOption,
    EditorMenuButton,
    IconAdd,
    IconFeedback,
    IconArrowDown,
    IconArrowUp,
    IconShuffle,
    IconTrash,
    InlineEditor,
    TaskScaffold,
    OptionsDefaults,
    OptionsFormEnum
  },

  props: {
    id: {
      type: String,
      required: true
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true
    },
    options: {
      type: Object as PropType<MAPOptions>,
      default() {
        return {};
      }
    },
    content: {
      type: Object as PropType<MAPContent>,
      default() {
        return {};
      }
    },
    evaluation: {
      type: Object as PropType<MAPEvaluation>,
      default() {
        return {};
      }
    },
    state: {
      type: Object as PropType<MAPState>,
      default() {
        return {};
      }
    }
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    /* Imports */
    // const { eventBus } = inject("eventBus") as InjectedEventBus;
    const { width, height, scrollTop, scrollLeft } = inject(
      "containerDimensions"
    ) as InjectedContainerDimensions;
    const { update } = useTask<MAPProps, MAPEmits, MAPOptions, MAPContent, MAPEvaluation, MAPState>(
      props,
      emit,
      [formatOptions, formatContent, formatEvaluation, formatState, formatEvents]
    );

    /* Variable */
    let sourceElement: Ref<string | null> = ref(null);
    let targetElement: Ref<string | null> = ref(null);
    const lines: Ref<{ source: string; target: string; line: LeaderLine }[]> = ref([]);
    const sourceRefs: Ref<typeof SourceOption[]> = ref([]);
    const targetRefs: Ref<typeof TargetOption[]> = ref([]);
    const handleRefs: Ref<Element[]> = ref([]);

    /* Content editing */
    const addOption = (isSourceOption: boolean = true) => {
      const content = isSourceOption ? props.content?.source || [] : props.content?.target || [];
      content.push({
        id: uuid(),
        content: { type: "doc", content: [{ type: "paragraph" }] }
      });
      update({
        content: {
          ...props.content,
          source: isSourceOption ? content : props.content?.source,
          target: !isSourceOption ? content : props.content?.target
        }
      });
    };

    const updateOptionContent = (
      option: MAPOption,
      answerOptionContent: JSONContent,
      isSourceOption: boolean = true
    ) => {
      update({
        content: {
          ...props.content,
          source: isSourceOption
            ? props.content?.source.map((o) =>
              option?.id === o.id ? { ...o, content: answerOptionContent } : o
            )
            : props.content?.source,
          target: !isSourceOption
            ? props.content?.target.map((o) =>
              option?.id === o.id ? { ...o, content: answerOptionContent } : o
            )
            : props.content?.target
        }
      });
    };

    const moveDownOption = (index: number, option: MAPOption, isSourceOption: boolean = true) => {
      const content = isSourceOption ? props.content?.source || [] : props.content?.target || [];
      if (Array.isArray(content) && index < content.length) {
        content.splice(index + 2, 0, option);
        content.splice(index, 1);
        update({
          content: {
            ...props.content,
            source: isSourceOption ? content : props.content?.source,
            target: !isSourceOption ? content : props.content?.target
          }
        });
      }
    };

    const moveUpOption = (index: number, option: MAPOption, isSourceOption: boolean = true) => {
      const content = isSourceOption ? props.content?.source || [] : props.content?.target || [];
      if (Array.isArray(content) && index < content.length) {
        content.splice(index - 1, 0, option);
        content.splice(index + 1, 1);
        update({
          content: {
            ...props.content,
            source: isSourceOption ? content : props.content?.source,
            target: !isSourceOption ? content : props.content?.target
          }
        });
      }
    };

    const removeOption = (index: number, isSourceOption: boolean = true) => {
      const content = isSourceOption ? props.content?.source || [] : props.content?.target || [];
      if (content.length > 1) {
        content.splice(index, 1);
        update({
          content: {
            ...props.content,
            source: isSourceOption ? content : props.content?.source,
            target: !isSourceOption ? content : props.content?.target
          }
        });
      }
    };

    const updateEvaluationName = (newName: string) => {
      switch (newName) {
        case "all-match":
        default:
          update({
            evaluation: {
              name: newName,
              solution:
                !!props.evaluation && !!props.evaluation.solution ? props.evaluation.solution : []
            }
          });
      }
    };

    const updateEvaluationMapping = (e: Event, sourceId: string) => {
      const targetId = (e.target as HTMLInputElement)?.value;
      update({
        evaluation: {
          ...props.evaluation,
          solution: props.evaluation?.solution.map((s) => {
            if (s.source === sourceId) {
              return { source: sourceId, target: targetId };
            } else if (s.target === targetId) {
              return { source: s.source, target: null };
            } else {
              return s;
            }
          })
        }
      });
    };

    const canAddMapping = computed(() => {
      return (
        props.content?.source.some(
          (o) => !props.evaluation?.solution.find((s) => s.source === o.id)
        ) &&
        props.content?.target.some(
          (o) => !props.evaluation?.solution.find((s) => s.target === o.id)
        )
      );
    });

    const addMapping = () => {
      if (canAddMapping) {
        const sourceNode = props.content?.source.find(
          (o) => !props.evaluation?.solution.find((s) => s.source === o.id)
        );
        const targetNode = props.content?.target.find(
          (o) => !props.evaluation?.solution.find((s) => s.target === o.id)
        );

        if (!!sourceNode && !!targetNode) {
          update({
            evaluation: {
              ...props.evaluation,
              solution: [
                ...props.evaluation.solution,
                {
                  source: sourceNode.id,
                  target: targetNode.id
                }
              ]
            }
          });
        }
      }
    };

    /* Drag and state management */

    const sourceDragging = (id: string) => {
      sourceElement.value = id;
    };

    const updateDraggingPosition = (event: MouseEvent) => {
      for (const targetRef of targetRefs.value) {
        const domRect = targetRef.getBoundingClientRect();

        if (
          event.clientX >= domRect.left &&
          event.clientX <= domRect.right &&
          event.clientY <= domRect.bottom &&
          event.clientY >= domRect.top
        ) {
          targetElement.value = targetRef.id;
          return;
        }
        targetElement.value = null;
      }
    };

    const stopDragging = () => {
      if (!!sourceElement.value && !!targetElement.value) {
        update({
          state: {
            ...props.state,
            answer: [
              ...props.state.answer.filter(
                (a) => a.source !== sourceElement.value && a.target !== targetElement.value
              ),
              {
                source: sourceElement.value,
                target: targetElement.value
              }
            ]
          }
        });
      }
      sourceElement.value = null;
      targetElement.value = null;
    };

    const cancelDragging = (e: MouseEvent | TouchEvent) => {
      for (const valueElement of sourceRefs.value) {
        valueElement.onInputEnd(e);
      }
    };

    watch([() => props.state, () => props.content, width, height, scrollTop, scrollLeft], () => {
      // Remove non-existing lines
      lines.value = lines.value.filter((line) => {
        if (
          width.value < 400 ||
          !props.state.answer.find((s) => s.source === line.source && s.target === line.target) ||
          props.editor.isEditable
        ) {
          line.line.remove();
          return false;
        } else {
          const sourceRef = sourceRefs.value.find((r) => r.id === line.source);
          const targetRef = targetRefs.value.find((r) => r.id === line.target);
          if (!!sourceRef && !!targetRef) {
            line.line.setOptions({
              start: LeaderLine.pointAnchor(sourceRef.$el, {
                x: sourceRef.$el.getBoundingClientRect().width + 13,
                y: sourceRef.$el.getBoundingClientRect().height / 2
              }),
              end: LeaderLine.pointAnchor(targetRef.$el, {
                x: -13,
                y: targetRef.$el.getBoundingClientRect().height / 2
              })
            });
          }
          return true;
        }
      });

      // Add new lines
      for (const answer of props.state.answer) {
        if (
          !!answer.target &&
          !lines.value.find((l) => l.source === answer.source && l.target === answer.target)
        ) {
          const sourceRef = sourceRefs.value.find((r) => r.id === answer.source);
          const targetRef = targetRefs.value.find((r) => r.id === answer.target);
          if (!!sourceRef && !!targetRef) {
            const newLine = new LeaderLine(
              LeaderLine.pointAnchor(sourceRef.$el, {
                x: sourceRef.$el.getBoundingClientRect().width + 13,
                y: sourceRef.$el.getBoundingClientRect().height / 2
              }),
              LeaderLine.pointAnchor(targetRef.$el, {
                x: -13,
                y: targetRef.$el.getBoundingClientRect().height / 2
              }),
              {
                startPlug: "behind",
                startSocket: "right",
                endPlug: "behind",
                endSocket: "left",
                color: "#2563eb"
              }
            );
            lines.value = [
              ...lines.value,
              {
                source: answer.source,
                target: answer.target,
                line: newLine
              }
            ];
          }
        }
      }

      // Update positions and color
      for (const line of lines.value) {
        line.line.position();

        if (["correct", "final-incorrect"].includes(props.state?.state)) {
          if (
            !props.evaluation?.solution.find(
              (s) => s.source === line.source && s.target === line.target
            )
          ) {
            line.line.setOptions({
              color: "#dc2626"
            });
          } else {
            line.line.setOptions({
              color: "#16a34a"
            });
          }
        }
      }
    });

    onUnmounted(() => {
      for (const line of lines.value) {
        line.line.remove();
      }
    });

    const removeConnection = (id: string) => {
      update({
        state: {
          ...props.state,
          answer: props.state.answer.filter((a) => a.target !== id)
        }
      });
    };

    return {
      update,
      width,
      sourceRefs,
      targetRefs,
      handleRefs,
      sourceElement,
      targetElement,
      updateOptionContent,
      addOption,
      removeOption,
      evaluationOptions,
      updateEvaluationName,
      updateEvaluationMapping,
      canAddMapping,
      addMapping,
      moveUpOption,
      moveDownOption,
      sourceDragging,
      updateDraggingPosition,
      stopDragging,
      cancelDragging,
      removeConnection
    };
  }
});
</script>
