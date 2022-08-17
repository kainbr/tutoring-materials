<template>
  <div class="flex flex-row items-center">
    <span class="text-sm py-0.5"> {{ $t("editor.trigger.builder-then") }} </span>

    <div v-for="(id, index) in trigger.feedbacks" :key="id">
      <span
        class="cursor-default inline-flex flex-nowrap items-center m-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        @mouseenter="
          editor.commands.addActiveFeedback(feedbacks.find((feedback) => feedback.id === id))
        "
        @mouseleave="
          editor.commands.removeActiveFeedback(feedbacks.find((feedback) => feedback.id === id))
        "
      >
        <!-- eslint-disable vue/no-v-html -->
        <LabelComponent :label="feedbacks.find((feedback) => feedback.id === id)?.label" />

        <button
          class="cursor-pointer flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-700 hover:bg-green-200 hover:text-green-800 focus:outline-none focus:bg-green-800 focus:text-white"
          type="button"
          @click="
            editor.commands.updateEventTrigger(trigger, {
              feedbacks: trigger.feedbacks.filter((s) => id !== s),
            })
          "
        >
          <span class="sr-only">Remove feedback</span>
          <IconClose class="h-3 w-3 fill-green-700" />
        </button>
      </span>
      <span v-if="index < trigger.feedbacks.length - 1">and </span>
    </div>
    <Combobox
      :model-value="trigger.feedbacks"
      multiple
      nullable
      @update:model-value="updateModelValue(trigger, $event)"
    >
      <ComboboxButton class="cursor-pointer">
        <span
          v-if="trigger.feedbacks.length === 0"
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          {{ $t("editor.trigger.builder-select-feedback") }}
        </span>
        <span
          v-else
          class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
        >
          +
        </span>
      </ComboboxButton>

      <ComboboxOptions
        class="absolute z-50 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
      >
        <div class="p-1">
          <ComboboxInput
            :display-trigger="(option) => option?.label"
            class="w-full w-60 border-none py-2 pl-3 text-sm leading-5 text-gray-900 focus:ring-0"
            @change="feedbacksQuery = $event.target.value"
          />
        </div>
        <ComboboxOption
          v-for="option in filteredFeedbackOptions"
          :key="option"
          v-slot="{ active, selected }"
          :value="option"
          as="template"
        >
          <li
            :class="[
              active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
              'flex flex-row w-full cursor-default select-none py-2',
            ]"
            @mouseenter="
              editor.commands.addActiveFeedback(
                feedbacks.find((feedback) => feedback.id === option)
              )
            "
            @mouseleave="
              editor.commands.removeActiveFeedback(
                feedbacks.find((feedback) => feedback.id === option)
              )
            "
          >
            <LabelComponent
              :label="feedbacks.find((feedback) => feedback.id === option)?.label"
              :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']"
            />
          </li>
        </ComboboxOption>
        <li
          v-if="filteredFeedbackOptions.length === 0"
          class="text-gray-900 w-full cursor-default select-none py-2 pl-4 pr-4"
        >
          <span class="font-normal text-xs block truncate">{{
            $t("editor:footer:trigger-empty-list")
          }}</span>
        </li>
      </ComboboxOptions>
    </Combobox>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import {
  Combobox,
  ComboboxButton,
  ComboboxInput,
  ComboboxOption,
  ComboboxOptions,
} from "@headlessui/vue";
import type { EventTrigger, Feedback } from "@/extensions/feedback/types";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import IconClose from "@/helpers/icons/IconClose.vue";
import { calculateHexIcon } from "@/helpers/util";
import LabelComponent from "@/helpers/LabelComponent.vue";

export default defineComponent({
  name: "FeedbackSelector",

  components: {
    LabelComponent,
    IconClose,
    Combobox,
    ComboboxButton,
    ComboboxInput,
    ComboboxOptions,
    ComboboxOption,
  },

  props: {
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
    trigger: {
      type: Object as PropType<EventTrigger>,
      required: true,
    },
  },

  emits: ["update:trigger"],

  data() {
    return {
      feedbacksQuery: "",
    };
  },

  computed: {
    feedbacks() {
      return this.editor.getAttributes("document").feedbacks;
    },
    feedbackOptions() {
      return this.editor
        .getAttributes("document")
        .feedbacks.map((feedback: Feedback) => feedback.id);
    },
    filteredFeedbackOptions() {
      return this.feedbacksQuery === ""
        ? this.feedbackOptions
        : this.feedbackOptions.filter((option: string) =>
            option
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(this.feedbacksQuery.toLowerCase().replace(/\s+/g, ""))
          );
    },
  },

  methods: {
    calculateHexIcon(str: string | undefined) {
      return calculateHexIcon(str);
    },
    addActiveFeedback(feedback) {
      console.log("addActiveFeedback", feedback);
      this.editor.commands.addActiveFeedback(
        this.editor.getAttributes("document").feedbacks.find((feedback) => feedback.id === feedback)
      );
    },
    removeActiveFeedback(feedback) {
      this.editor.commands.removeActiveFeedback(
        this.editor.getAttributes("document").feedbacks.find((feedback) => feedback.id === feedback)
      );
    },
    updateModelValue(trigger, $event) {
      this.editor.commands.updateEventTrigger(trigger, {
        feedbacks: $event,
      });
    },
  },
});
</script>
