<template>
  <span v-if="conditions.length > 0" class="text-sm py-0.5">
    {{ $t("editor.trigger.builder-and") }}
  </span>

  <!-- Badges -->
  <div v-for="(rule, index) in trigger.rules" :key="rule.id">
    <span
      class="inline-flex flex-nowrap items-center mx-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
    >
      <RuleEditor
        :rule="rule"
        :condition="conditions.find((condition) => rule.fact === condition.fact)"
        @update:rule="updateRule(rule, $event)"
      />
      <button
        class="flex-shrink-0 ml-0.5 h-4 w-4 rounded-full inline-flex items-center justify-center text-yellow-700 hover:bg-yellow-300 hover:text-yellow-800 focus:outline-none focus:bg-yellow-800 focus:text-white"
        type="button"
        @click="removeRule(rule)"
      >
        <span class="sr-only">Remove condition</span>
        <svg class="h-2 w-2" fill="none" stroke="currentColor" viewBox="0 0 8 8">
          <path d="M1 1l6 6m0-6L1 7" stroke-linecap="round" stroke-width="1.5" />
        </svg>
      </button>
    </span>
    <span v-if="index < trigger.rules.length - 1"> {{ $t("editor.trigger.builder-and") }} </span>
  </div>

  <!-- Dropdown -->
  <Combobox v-if="conditions.length > 0" :model-value="conditions" class="pr-2">
    <div>
      <div class="flex gap-1">
        <ComboboxButton class="cursor-pointer">
          <div class="pl-2">
            <span
              v-if="trigger.rules.length === 0"
              class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800"
            >
              Select condition
            </span>
          </div>
          <span
            v-if="trigger.rules.length > 0"
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
            v-for="condition in conditions"
            :key="condition.fact"
            v-slot="{ active, selected }"
            as="template"
            @click="addRule(condition)"
          >
            <li
              :class="[
                active ? 'bg-amber-100 text-amber-900' : 'text-gray-900',
                'relative w-full cursor-default select-none py-2 pl-4 pr-4',
              ]"
            >
              <span :class="[selected ? 'font-semibold' : 'font-normal', 'block truncate']">
                <LabelComponent
                  :label="!!condition.previewLabel ? condition.previewLabel : condition.label"
                />
              </span>
            </li>
          </ComboboxOption>
        </ComboboxOptions>
      </transition>
    </div>
  </Combobox>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Combobox, ComboboxButton, ComboboxOption, ComboboxOptions } from "@headlessui/vue";
import { isEqual } from "lodash-es";
import { v4 as uuid } from "uuid";
import LabelComponent from "@/helpers/LabelComponent.vue";
import RuleEditor from "@/extensions/feedback/helpers/RuleEditor.vue";

import type { EventRule, EventTrigger, EventCondition } from "@/extensions/feedback/types";
import type { PropType } from "vue";

export default defineComponent({
  name: "ConditionSelector",

  components: {
    RuleEditor,
    LabelComponent,
    Combobox,
    ComboboxButton,
    ComboboxOptions,
    ComboboxOption,
  },

  props: {
    conditions: {
      type: Array as PropType<EventCondition[]>,
      required: true,
    },
    trigger: {
      type: Object as PropType<EventTrigger>,
      required: true,
    },
  },

  emits: ["update:rules"],

  watch: {
    conditions(newConditions) {
      const availableFacts = newConditions.map((c: EventCondition) => c.fact);
      const newRules = this.trigger.rules.filter((r: EventRule) => availableFacts.includes(r.fact));
      if (newRules.length !== this.trigger.rules.length) {
        this.$emit("update:rules", newRules);
      }
    },
  },

  methods: {
    getConditionByRule(rule: EventRule) {
      return this.conditions.find((condition: EventCondition) => rule.fact === condition.fact);
    },
    addRule(condition: EventCondition) {
      const rule: EventRule = {
        id: uuid(),
        fact: condition.fact,
        operation: condition.defaultOperation,
        value: condition.defaultValue,
      };

      this.$emit("update:rules", [...this.trigger.rules, rule]);
    },
    updateRule(rule: EventRule, newRule: EventRule) {
      this.$emit(
        "update:rules",
        this.trigger.rules.map((r: EventRule) => (isEqual(rule, r) ? newRule : r))
      );
    },
    removeRule(rule: EventRule) {
      this.$emit(
        "update:rules",
        this.trigger.rules.filter((r: EventRule) => !isEqual(r, rule))
      );
    },
  },
});
</script>
