<template>
  <span class="text-sm py-0.5"> {{ $t("editor.trigger.builder-then") }} </span>

  <!-- Existing feedbacks -->
  <div v-for="(feedback, index) in triggerFeedbacks" :key="feedback.id">
    <span
      class="cursor-default inline-flex flex-nowrap items-center mx-1 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
    >
      <LabelComponent :label="feedback.label" />

      <!-- Remove button -->
      <button
        class="cursor-pointer flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-700 hover:bg-green-200 hover:text-green-800 focus:outline-none focus:bg-green-800 focus:text-white"
        type="button"
        @click="removeFeedback(feedback)"
      >
        <span class="sr-only">Remove feedback</span>
        <IconClose class="h-3 w-3 fill-green-700" />
      </button>
    </span>
    <span v-if="index < trigger.feedbacks.length - 1">{{ $t("editor.trigger.builder-and") }} </span>
  </div>

  <!-- Dropdown for new feedbacks -->
  <Combobox
    :model-value="trigger.feedbacks"
    multiple
    nullable
    @update:model-value="$emit('update:feedbacks', $event)"
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
      class="absolute z-50 max-h-60 w-fit overflow-auto rounded-md bg-white text-xs shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
    >
      <!--suppress JSValidateTypes -->
      <ComboboxOption
        v-for="feedback in filteredFeedbacks"
        v-slot="{ active, selected }"
        :key="feedback.id"
        :value="feedback.id"
        as="template"
      >
        <li
          :class="[
            active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
            'flex flex-row w-full cursor-default select-none py-2 px-3',
          ]"
        >
          <LabelComponent
            :label="feedback.label"
            :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']"
          />
        </li>
      </ComboboxOption>
      <li
        v-if="filteredFeedbacks.length === 0"
        class="text-gray-900 w-full cursor-default select-none py-2 pl-4 pr-4"
      >
        <span class="font-normal text-xs block truncate">{{
          $t("editor.footer.trigger-empty-list")
        }}</span>
      </li>
    </ComboboxOptions>
  </Combobox>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Combobox, ComboboxButton, ComboboxOption, ComboboxOptions } from "@headlessui/vue";
import IconClose from "@/helpers/icons/IconClose.vue";
import LabelComponent from "@/helpers/LabelComponent.vue";

import type { Editor } from "@tiptap/vue-3";
import type { EventTrigger, Feedback } from "@/extensions/feedback/types";
import type { PropType } from "vue";

export default defineComponent({
  name: "FeedbackSelector",

  components: {
    LabelComponent,
    IconClose,
    Combobox,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
  },

  props: {
    feedbacks: {
      type: Array as PropType<Feedback[]>,
      required: true,
    },
    trigger: {
      type: Object as PropType<EventTrigger>,
      required: true,
    },
    editor: {
      type: Object as PropType<Editor>,
      required: true,
    },
  },

  emits: ["update:trigger", "update:feedbacks"],

  data() {
    return {
      feedbacksQuery: "",
    };
  },

  computed: {
    triggerFeedbacks() {
      return this.trigger.feedbacks.map(
        (feedbackId: string) =>
          this.feedbacks.find((feedback: Feedback) => feedback.id === feedbackId) as Feedback
      );
    },
    filteredFeedbacks() {
      return this.feedbacksQuery === ""
        ? this.feedbacks
        : this.feedbacks.filter((feedback: Feedback) =>
            (!!feedback.label?.message ? this.$t(feedback.label?.message) : feedback.type)
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(this.feedbacksQuery.toLowerCase().replace(/\s+/g, ""))
          );
    },
  },

  methods: {
    removeFeedback(feedback: Feedback) {
      this.$emit(
        "update:feedbacks",
        this.trigger.feedbacks.filter((feedbackId: string) => feedback.id !== feedbackId)
      );
    },
  },
});
</script>
