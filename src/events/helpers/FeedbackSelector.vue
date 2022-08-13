<template>
  <div class="flex flex-row w-full flex-wrap items-center">
    <div v-for="(feedbackId, index) in trigger.feedbackIds" :key="feedbackId">
      <span
        class="cursor-default inline-flex flex-nowrap items-center m-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800"
        @mouseenter="
          stateStore.addFeedback(
            document.node.attrs.feedbacks.find((feedback) => feedback.id === feedbackId)
          )
        "
        @mouseleave="
          stateStore.removeFeedback(
            document.node.attrs.feedbacks.find((feedback) => feedback.id === feedbackId)
          )
        "
      >
        <!-- eslint-disable vue/no-v-html -->
        <span class="pr-1" v-html="calculateHexIcon(feedbackId)" />
        <span>
          {{
            $t(
              "global.feedback.type-" +
                (document.node.attrs.feedbacks.find((feedback) => feedback.id === feedbackId)
                  ?.type || "missing-label")
            )
          }}
        </span>
        <button
          class="cursor-pointer flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-green-700 hover:bg-green-200 hover:text-green-800 focus:outline-none focus:bg-green-800 focus:text-white"
          type="button"
          @click="
            editor.commands.updateEventTrigger(trigger, {
              feedbackIds: trigger.feedbackIds.filter((s) => feedbackId !== s),
            })
          "
        >
          <span class="sr-only">Remove feedback</span>
          <IconClose class="h-3 w-3 fill-green-700" />
        </button>
      </span>
      <span v-if="index < trigger.feedbackIds.length - 1">and </span>
    </div>
    <Combobox
      :model-value="trigger.feedbackIds"
      multiple
      nullable
      @update:model-value="
        editor.commands.updateEventTrigger(trigger, {
          feedbackIds: $event,
        })
      "
    >
      <ComboboxButton class="cursor-pointer">
        <span
          v-if="trigger.feedbackIds.length === 0"
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

      <transition
        leave-active-class="transition duration-100 ease-in"
        leave-from-class="opacity-100"
        leave-to-class="opacity-0"
      >
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
                stateStore.addFeedback(
                  document.node.attrs.feedbacks.find((feedback) => feedback.id === option)
                )
              "
              @mouseleave="
                stateStore.removeFeedback(
                  document.node.attrs.feedbacks.find((feedback) => feedback.id === option)
                )
              "
            >
              <span class="px-2" v-html="calculateHexIcon(option)" />
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">{{
                $t(
                  "global.feedback.type-" +
                    (document.node.attrs.feedbacks.find((feedback) => feedback.id === option)
                      ?.type || "missing-label")
                )
              }}</span>
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
      </transition>
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
import type { EventTrigger, Feedback } from "@/types";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import { findChildren } from "@tiptap/core";
import IconClose from "@/helpers/icons/IconClose.vue";
import { calculateHexIcon } from "@/helpers/util";

export default defineComponent({
  name: "FeedbackSelector",

  components: {
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
      stateStore: this.editor.storage.document.stateStore(),
    };
  },

  computed: {
    document() {
      return findChildren(this.editor.state.doc, (node) => node.type.name === "document")[0];
    },
    feedbackOptions() {
      return this.document.node.attrs.feedbacks.map((feedback: Feedback) => feedback.id);
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
  },
});
</script>
