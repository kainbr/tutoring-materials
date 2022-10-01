<template>
  <TaskScaffold contenteditable="false" :editor="editor">
    <!-- Render -->
    <template #render>
      <GapEditor
        :content="content"
        :evaluation="evaluation"
        :options="options"
        :state="state"
        @update:state="
          update({
            state: $event,
          })
        "
      ></GapEditor>
    </template>

    <!-- Content -->
    <template #content>
      <GapEditor
        :content="content"
        :evaluation="evaluation"
        :options="options"
        is-editor
        @update:content="
          update({
            content: $event,
          })
        "
        @update:evaluation="
          update({
            evaluation: $event,
          })
        "
      ></GapEditor>
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
      <div v-if="options" class="mt-1 flex flex-col gap-2">
        <OptionsFormString
          name="textSelectGapPlaceholder"
          :value="
            options.textSelectGapPlaceholder || $t('global.options.text-select-gap-placeholder')
          "
          :label="$t('editor.task.config-text-select-gap-placeholder')"
          @update:value="update({ options: { ...options, textSelectGapPlaceholder: $event } })"
        />
        <OptionsDefaults
          :options="options"
          allow-empty-answer-submission
          has-max-attempts
          has-submit-button
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
import { defineComponent } from "vue";
// import { inject } from "vue";
import { formatContent } from "@/extensions/task/fill-the-blank/format/content";
import {
  formatEvaluation,
  evaluationOptions,
} from "@/extensions/task/fill-the-blank/format/evaluation";
import { formatOptions } from "@/extensions/task/fill-the-blank/format/options";
import { formatState } from "@/extensions/task/fill-the-blank/format/state";
import { useTask } from "@/extensions/task/helpers";

import GapEditor from "@/extensions/task/fill-the-blank/GapEditor.vue";
import TaskScaffold from "@/extensions/task/helpers/TaskScaffold.vue";

import type { PropType } from "vue";
import type {
  FTBEvaluation,
  FTBOptions,
  FTBState,
  FTBProps,
  FTBEmits,
  FTBContent,
} from "@/extensions/task/fill-the-blank/types";
import type { Editor } from "@tiptap/vue-3";
import OptionsFormEnum from "@/extensions/task/helpers/OptionsFormEnum.vue";
import OptionsDefaults from "@/extensions/task/helpers/OptionsDefaults.vue";
import { formatEvents } from "@/extensions/task/fill-the-blank/format/events";
import OptionsFormString from "@/extensions/task/helpers/OptionsFormString.vue";

export default defineComponent({
  name: "TaskFillTheBlank",

  components: {
    OptionsFormString,
    GapEditor,
    TaskScaffold,
    OptionsDefaults,
    OptionsFormEnum,
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
      type: Object as PropType<FTBOptions>,
      default() {
        return {};
      },
    },
    content: {
      type: Object as PropType<FTBContent>,
      default() {
        return {};
      },
    },
    evaluation: {
      type: Object as PropType<FTBEvaluation>,
      default() {
        return {};
      },
    },
    state: {
      type: Object as PropType<FTBState>,
      default() {
        return {};
      },
    },
  },

  emits: ["update", "submit"],

  setup(props, { emit }) {
    // const { eventBus } = inject("eventBus") as InjectedEventBus;

    const { update } = useTask<FTBProps, FTBEmits, FTBOptions, FTBContent, FTBEvaluation, FTBState>(
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

    return {
      update,
      evaluationOptions,
      updateEvaluationName,
    };
  },
});
</script>
