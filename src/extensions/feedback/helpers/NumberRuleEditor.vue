<template>
  <div class="flex flex-row gap-1">
    <Listbox>
      <ListboxButton>
        <span v-if="rule.operation === 'smaller'">
          {{ $t("global.condition.number.label-smaller") }}
        </span>
        <span v-if="rule.operation === 'smaller-equal'">
          {{ $t("global.condition.number.label-smaller-equal") }}
        </span>
        <span v-if="rule.operation === 'equal'">
          {{ $t("global.condition.number.label-equal") }}
        </span>
        <span v-if="rule.operation === 'greater-equal'">
          {{ $t("global.condition.number.label-greater-equal") }}
        </span>
        <span v-if="rule.operation === 'greater'">
          {{ $t("global.condition.number.label-greater") }}
        </span>
      </ListboxButton>
      <ListboxOptions
        class="absolute mt-1 px-2 w-auto overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
      >
        <ListboxOption class="cursor-pointer select-none" @click="updateOperation('smaller')">
          <span>
            {{ $t("global.condition.number.label-smaller") }}
          </span>
        </ListboxOption>
        <ListboxOption class="cursor-pointer select-none" @click="updateOperation('smaller-equal')">
          <span>
            {{ $t("global.condition.number.label-smaller-equal") }}
          </span>
        </ListboxOption>
        <ListboxOption class="cursor-pointer select-none" @click="updateOperation('equal')">
          <span>
            {{ $t("global.condition.number.label-equal") }}
          </span>
        </ListboxOption>
        <ListboxOption class="cursor-pointer select-none" @click="updateOperation('greater-equal')">
          <span>
            {{ $t("global.condition.number.label-greater-equal") }}
          </span>
        </ListboxOption>
        <ListboxOption class="cursor-pointer select-none" @click="updateOperation('greater')">
          <span>
            {{ $t("global.condition.number.label-greater") }}
          </span>
        </ListboxOption>
      </ListboxOptions>
    </Listbox>

    <span class="max-w-fit">
      <input
        type="number"
        class="bg-transparent cursor-pointer appearance-none w-8"
        :value="rule.value"
        :min="min"
        :max="max"
        :step="step"
        @change="updateValue"
      />
    </span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { Listbox, ListboxButton, ListboxOption, ListboxOptions } from "@headlessui/vue";

import type { PropType } from "vue";
import type {
  EventCondition,
  NumberConditionOptions,
  NumberEventRule,
} from "@/extensions/feedback/types";

export default defineComponent({
  name: "NumberRuleEditor",

  components: {
    Listbox,
    ListboxButton,
    ListboxOptions,
    ListboxOption,
  },

  props: {
    rule: {
      type: Object as PropType<NumberEventRule>,
      required: true,
    },
    condition: {
      type: Object as PropType<EventCondition>,
      required: true,
    },
  },

  emits: ["update:rule"],

  computed: {
    min() {
      return (this.condition.options as NumberConditionOptions)?.min;
    },
    max() {
      return (this.condition.options as NumberConditionOptions)?.max;
    },
    step() {
      return (this.condition.options as NumberConditionOptions)?.step;
    },
  },

  methods: {
    updateOperation(operation: string) {
      this.$emit("update:rule", {
        ...this.rule,
        operation,
      });
    },

    updateValue($event: Event) {
      this.$emit("update:rule", {
        ...this.rule,
        value: ($event.target as HTMLSelectElement).value,
      });
    },
  },
});
</script>
