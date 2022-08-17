<template>
  <div v-if="conditionOptions.length > 0" class="flex flex-row items-center">
    <span class="text-sm py-0.5"> {{ $t("editor.trigger.builder-and") }} </span>
    <div v-for="(condition, index) in trigger.conditions" :key="condition.name">
      <span
        class="inline-flex flex-nowrap items-center m-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
      >
        <span class="cursor-pointer">
          <LabelComponent
            :label="conditionOptions.find((option) => condition.name === option.name).label"
          />
          <!--
            <span v-if="condition.label.hexIcon" class="px-2" v-html="condition.label.hexIcon" />
            {{ $t(condition.label.message, condition.label.data) }}
          {{ condition }}<br />
          {{ conditionOptions.find((option) => condition.name === option.name) }}
            -->
        </span>
        <button
          class="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-yellow-700 hover:bg-yellow-300 hover:text-yellow-800 focus:outline-none focus:bg-yellow-800 focus:text-white"
          type="button"
        >
          <span class="sr-only">Remove condition</span>
          <svg class="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
            <path d="M1 1l6 6m0-6L1 7" stroke-linecap="round" stroke-width="1.5" />
          </svg>
        </button>
      </span>
      <span v-if="index < trigger.conditions.length - 1"> and </span>
    </div>
    <Combobox
      :model-value="trigger.conditions.map((c) => c.name)"
      class="pr-2"
      multiple
      nullable
      @update:model-value="updateEventConditionsList(trigger, $event)"
    >
      <div class="relative">
        <div class="flex gap-1">
          <ComboboxButton class="cursor-pointer">
            <div class="pl-2">
              <span
                v-if="trigger.conditions.length === 0"
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
              >
                Select condition
              </span>
            </div>
            <span
              v-if="trigger.conditions.length > 0"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              +
            </span>
          </ComboboxButton>
        </div>

        <transition
          leave-active-class="transition duration-100 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <ComboboxOptions
            class="absolute z-50 max-h-60 w-fit overflow-auto rounded-md bg-white py-1 text-sm shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
          >
            <ComboboxOption
              v-for="option in filteredConditionOptions"
              :key="option"
              v-slot="{ active, selected }"
              :value="option.name"
              as="template"
            >
              <li
                :class="[
                  active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                  'relative w-full cursor-default select-none py-2 pl-4 pr-4',
                ]"
              >
                <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                  <span v-if="option.label.hexIcon" class="px-2" v-html="option.label.hexIcon" />
                  {{ $t(option.label.message, option.label.data) }}
                </span>
              </li>
            </ComboboxOption>
          </ComboboxOptions>
        </transition>
      </div>
    </Combobox>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Combobox, ComboboxButton, ComboboxOption, ComboboxOptions } from "@headlessui/vue";
import type {
  EventCondition,
  EventOption,
  EventOptionCondition,
  EventTrigger,
} from "@/extensions/feedback/types";
import type { PropType } from "vue";
import type { Editor } from "@tiptap/vue-3";
import LabelComponent from "@/helpers/LabelComponent.vue";

export default defineComponent({
  name: "ConditionSelector",

  components: {
    LabelComponent,
    Combobox,
    ComboboxButton,
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

  emits: ["update:conditions"],

  data() {
    return {
      conditionsQuery: "",
    };
  },

  computed: {
    conditionOptions(): EventOptionCondition[] {
      return (
        this.editor.storage.feedback.eventOptions?.find(
          (eventOption: EventOption) =>
            eventOption.name === this.trigger.event && eventOption.parent === this.trigger.parent
        )?.conditions || []
      );
    },
    filteredConditionOptions(): EventOptionCondition[] {
      return this.conditionsQuery === ""
        ? this.conditionOptions
        : this.conditionOptions.filter((option: EventOptionCondition) =>
            option.name
              .toLowerCase()
              .replace(/\s+/g, "")
              .includes(this.conditionsQuery.toLowerCase().replace(/\s+/g, ""))
          );
    },
  },

  methods: {
    updateEventConditionsList(trigger: EventTrigger, newConditionNames: string[]) {
      console.log("updateModelValue", trigger, newConditionNames);
      this.editor.commands.updateEventTrigger(trigger, {
        conditions: newConditionNames.map((newConditionName) => {
          const eventCondition = trigger.conditions.find(
            (condition: EventCondition) => condition.name === newConditionName
          );

          if (!eventCondition) {
            // The following value is always available and null values can be omitted
            const newCondition = this.conditionOptions.find(
              (option) => option.name === newConditionName
            ) as unknown as EventOptionCondition;
            return {
              name: newCondition.name,
              variable: newCondition.variable,
              value: newCondition.default,
            };
          } else {
            return eventCondition;
          }
        }),
      });
    },
  },
});
</script>
